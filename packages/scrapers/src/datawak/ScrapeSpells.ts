import {
  FileSystemDirectoryAccess,
  NoitaConstants,
  noitaPaths,
  NoitaSpell,
  NoitaTranslation,
  SpellModifierNumberUnit,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { proxiedPropertiesOf, stringHelpers } from '@noita-explorer/tools';
import { LuaWrapper } from '@noita-explorer/tools/lua';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';

export const scrapeSpells = async ({
  dataWakDirectoryApi,
  translations,
}: {
  dataWakDirectoryApi: FileSystemDirectoryAccess;
  translations: StringKeyDictionary<NoitaTranslation>;
}) => {
  const spellListLuaScriptPath = await dataWakDirectoryApi.path.join(
    noitaPaths.noitaDataWak.luaScripts.guns,
  );
  const spellListLuaScriptFile = await dataWakDirectoryApi.getFile(
    spellListLuaScriptPath,
  );
  const text = await spellListLuaScriptFile.read.asText();
  const luaWrapper = LuaWrapper(text);

  const actionListStatement = luaWrapper
    .findTopLevelAssignmentStatement('actions')
    .first();

  const luaActionsArray = actionListStatement.asArrayObjectDeclarationList();

  const spells: NoitaSpell[] = [];

  for (const luaSpell of luaActionsArray) {
    const spell: NoitaSpell = {
      id: luaSpell.getRequiredField('id').required.asString(),
      name: luaSpell.getRequiredField('name').required.asString(),
      description: luaSpell.getRequiredField('description').required.asString(),
      imageBase64: '',
      type: luaSpell.getRequiredField('type').required.asIdentifier(),

      maxUses: luaSpell.getField('max_uses')?.asNumber(),
      price: luaSpell.getRequiredField('price').required.asNumber(),
      manaDrain: luaSpell.getField('mana')?.asNumber(),
      isDangerousBlast:
        luaSpell.getField('is_dangerous_blast')?.asBoolean() ?? false,
      neverUnlimited:
        luaSpell.getField('never_unlimited')?.asBoolean() ?? false,
      recursive: luaSpell.getField('recursive')?.asBoolean() ?? false,
      spawnRequiredFlag: luaSpell.getField('spawn_required_flag')?.asString(),
      drawActions: undefined,

      explosionDontDamageShooter: false,
      friendlyFire: false,
      lifetime: undefined,
      lifetimeRandomness: undefined,
      diggingPower: undefined,

      projectileDamage: undefined,
      explosionDamage: undefined,
      explosionRadius: undefined,
      sliceDamage: undefined,
      meleeDamage: undefined,
      healingDamage: undefined,
      regenerationFrames: undefined,
      fireDamage: undefined,
      iceDamage: undefined,
      holyDamage: undefined,
      drillDamage: undefined,

      projectileDamageModifier: undefined,
      fireRateWaitModifier: undefined,
      lifetimeModifier: undefined,
      recoilModifier: undefined,
      reloadTimeModifier: undefined,
      speedModifier: undefined,
      spreadDegreesModifier: undefined,
      explosionRadiusModifier: undefined,
      explosionDamageModifier: undefined,
      iceDamageModifier: undefined,
      electricityDamage: undefined,
    };

    // Load the translation
    const spellName = stringHelpers.trim({ text: spell.name, fromStart: '$' });
    const spellNameTranslation = translations[spellName];
    if (spellNameTranslation) {
      spell.name = spellNameTranslation.en;
    }

    const spellDescription = stringHelpers.trim({
      text: spell.description,
      fromStart: '$',
    });
    const spellDescriptionTranslation = translations[spellDescription];
    if (spellDescriptionTranslation) {
      spell.description = spellDescriptionTranslation.en;
    }

    // load the image
    const sprite: string = luaSpell
      .getRequiredField('sprite')
      .required.asString();
    const imagePath = await dataWakDirectoryApi.path.join(sprite.split('/'));
    const imageFile = await dataWakDirectoryApi.getFile(imagePath);
    spell.imageBase64 = await imageFile.read.asImageBase64();

    // load other data

    const xmlFiles = luaSpell.getField('related_projectiles')?.asArray();
    try {
      if (Array.isArray(xmlFiles)) {
        for (const xmlFilePathValue of xmlFiles) {
          const xmlFilePath = xmlFilePathValue.asString();
          if (xmlFilePath !== undefined) {
            await scrapeXmlSpellData(dataWakDirectoryApi, xmlFilePath, spell);
          }
        }
      }
    } catch (e) {
      console.log('error', e);
      console.log('at spell', spell);
    }

    // Multiply the damages by the damage multiplier
    const proxiedSpell = proxiedPropertiesOf(spell);
    const damages = [
      proxiedSpell.meleeDamage,
      proxiedSpell.projectileDamage,
      proxiedSpell.fireDamage,
      proxiedSpell.explosionDamage,
      proxiedSpell.healingDamage,
      proxiedSpell.sliceDamage,
      proxiedSpell.electricityDamage,
      proxiedSpell.drillDamage,
      proxiedSpell.iceDamage,
      proxiedSpell.holyDamage,
    ];
    for (const damage of damages) {
      if (
        damage !== undefined &&
        damage in spell &&
        spell[damage] !== undefined
      ) {
        spell[damage] *= NoitaConstants.damageMultiplier;
      }
    }

    const action = luaSpell.getField('action')?.asFunction();
    if (action !== undefined) {
      const actionStatements = action.getAssignments().map((a) => a.first());

      for (const statement of actionStatements) {
        const name = statement.getName();

        const expressionParts = statement.asExpression();

        if (name === 'c.friendly_fire') {
          if (expressionParts.length > 0 && expressionParts[0].value === true)
            spell.friendlyFire = true;
          continue;
        }

        const numberExpressions = expressionParts.filter(
          (p) => typeof p.value === 'number',
        );

        if (numberExpressions.length === 0) {
          continue;
        }

        let operator = numberExpressions[0].operator;
        if (expressionParts.length === 1) operator = '=';

        const modifierNumberUnit: SpellModifierNumberUnit = {
          value: numberExpressions[0].value as number,
          operator: operator,
        };

        if (name === 'c.speed_multiplier')
          spell.speedModifier = modifierNumberUnit;
        else if (name === 'c.fire_rate_wait')
          spell.fireRateWaitModifier = modifierNumberUnit;
        else if (name === 'c.lifetime_add')
          spell.lifetimeModifier = modifierNumberUnit;
        else if (name === 'c.spread_degrees')
          spell.spreadDegreesModifier = modifierNumberUnit;
        else if (name === 'c.explosion_radius')
          spell.explosionRadiusModifier = modifierNumberUnit;
        else if (name === 'c.damage_explosion_add')
          spell.explosionDamageModifier = modifierNumberUnit;
        else if (name === 'c.damage_ice_add')
          spell.iceDamageModifier = modifierNumberUnit;
        else if (name === 'c.damage_projectile_add')
          spell.projectileDamageModifier = modifierNumberUnit;
        else if (name === 'current_reload_time')
          spell.reloadTimeModifier = modifierNumberUnit;
        else if (name === 'shot_effects.recoil_knockback')
          spell.recoilModifier = modifierNumberUnit;
      }

      if (spell.projectileDamageModifier)
        spell.projectileDamageModifier.value *= NoitaConstants.damageMultiplier;
      if (spell.iceDamageModifier)
        spell.iceDamageModifier.value *= NoitaConstants.damageMultiplier;
      if (spell.explosionDamageModifier)
        spell.explosionDamageModifier.value *= NoitaConstants.damageMultiplier;

      const drawActionCall = action.findCallAssignment('draw_actions');
      if (drawActionCall) {
        const args = drawActionCall.arguments();
        if (args && args.length > 0) {
          const argsUnary = args[0].asUnary();

          // for handling draw_actions( #deck, true ) for BURST_X
          spell.drawActions =
            argsUnary &&
            argsUnary.operator === '#' &&
            argsUnary.value.asIdentifier() === 'deck'
              ? 'remaining'
              : args[0].asNumber();
        }
      }
    }

    spells.push(spell);
  }

  return spells;
};

const scrapeXmlSpellData = async (
  dataWakDirectoryApi: FileSystemDirectoryAccess,
  xmlRelativePath: string,
  spell: NoitaSpell,
) => {
  const xmlFilePath = await dataWakDirectoryApi.path.join(
    xmlRelativePath.split('/'),
  );
  const xmlFileExists =
    await dataWakDirectoryApi.checkRelativePathExists(xmlFilePath);
  if (!xmlFileExists) return spell;

  const xmlFile = await dataWakDirectoryApi.getFile(xmlFilePath);

  const xmlText = await xmlFile.read.asText();
  const xmlObj = await parseXml(xmlText);
  const xml = XmlWrapper(xmlObj);

  // this is in the main xml file
  const hitEffects = xml.findTagArray('HitEffectComponent');
  for (const hitEffect of hitEffects) {
    // specific for healhurt (Deadly Heal), in this xml will be the Regeneration Game effect
    const effect = hitEffect.getAttribute('value_string')?.asText();
    if (effect?.endsWith('.xml')) {
      await scrapeXmlSpellData(dataWakDirectoryApi, effect, spell);
    }
  }

  // this could come from the HitEffectComponent
  const gameEffects = xml.findTagArray('GameEffectComponent');
  for (const gameEffect of gameEffects) {
    const effect = gameEffect.getAttribute('effect')?.asText();
    const frames = gameEffect.getAttribute('frames')?.asInt();

    if (effect === 'REGENERATION' && frames !== undefined && frames > 0) {
      spell.regenerationFrames = frames;
    }
  }

  const lifetimeComponent = xml.findNthTag('LifetimeComponent');
  if (lifetimeComponent !== undefined) {
    spell.lifetime ??= lifetimeComponent.getAttribute('lifetime')?.asInt();
  }

  const projectileComponent = xml.findNthTag('ProjectileComponent', 0);

  if (projectileComponent !== undefined) {
    spell.lifetime ??= projectileComponent.getAttribute('lifetime')?.asInt();
    spell.lifetimeRandomness ??= projectileComponent
      .getAttribute('lifetime_randomness')
      ?.asInt();
    spell.projectileDamage ??= projectileComponent
      .getAttribute('damage')
      ?.asFloat();

    spell.explosionDontDamageShooter =
      projectileComponent
        .getAttribute('explosion_dont_damage_shooter')
        ?.asBoolean() ?? false;

    if (
      projectileComponent.getAttribute('friendly_fire')?.asBoolean() === true
    ) {
      spell.friendlyFire = true;
    }

    const damageGameEffectEntities = stringHelpers.trim({
      text:
        projectileComponent
          .getAttribute('damage_game_effect_entities')
          ?.asText() ?? '',
      fromEnd: ',',
    });
    if (damageGameEffectEntities?.endsWith('.xml')) {
      await scrapeXmlSpellData(
        dataWakDirectoryApi,
        damageGameEffectEntities,
        spell,
      );
    }

    const explosionConfig = projectileComponent.findNthTag(
      'config_explosion',
      0,
    );

    if (explosionConfig !== undefined) {
      spell.diggingPower ??= explosionConfig
        .getAttribute('ray_energy')
        ?.asInt();
      spell.explosionDamage ??= explosionConfig
        .getAttribute('damage')
        ?.asFloat();
      spell.explosionRadius ??= explosionConfig
        .getAttribute('explosion_radius')
        ?.asInt();
    }

    const damageByType = projectileComponent.findNthTag('damage_by_type', 0);
    if (damageByType !== undefined) {
      spell.healingDamage ??= damageByType.getAttribute('healing')?.asFloat();
      spell.sliceDamage ??= damageByType.getAttribute('slice')?.asFloat();
      spell.meleeDamage ??= damageByType.getAttribute('melee')?.asFloat();
      spell.fireDamage ??= damageByType.getAttribute('fire')?.asFloat();
      spell.drillDamage ??= damageByType.getAttribute('drill')?.asFloat();
      spell.iceDamage ??= damageByType.getAttribute('ice')?.asFloat();
      spell.holyDamage ??= damageByType.getAttribute('holy')?.asFloat();
      spell.electricityDamage ??= damageByType
        .getAttribute('electricity')
        ?.asFloat();
    }
  }

  return spell;
};
