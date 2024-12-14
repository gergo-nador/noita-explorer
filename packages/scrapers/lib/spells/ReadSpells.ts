import { NoitaTranslationsModel } from '../NoitaTranslations';
import path from 'path';
import { noitaPaths } from '../NoitaPaths';
import {
  checkPathExist,
  readFileAsText,
  readImageAsBase64,
} from '../../utils/FileSystem';
import {
  NoitaSpell,
  NoitaConstants,
  StringKeyDictionary,
  SpellModifierUnit,
} from '../../../common';
import { trim } from '../../utils/StringUtils';
import { parseLua } from '../../utils/LuaUtils';
import { parseXmlFile, XmlWrapper } from '../../utils/XmlUtils';

// https://noita.wiki.gg/wiki/Damage_Types
export const readSpells = async ({
  dataWakExtractedPath,
  translationsModel,
}: {
  dataWakExtractedPath: string;
  translationsModel: NoitaTranslationsModel;
}) => {
  const spell_list_path = path.join(
    dataWakExtractedPath,
    noitaPaths.noitaDataWak.luaScripts.guns,
  );

  const text = await readFileAsText(spell_list_path);
  const parsed = parseLua({ text });

  const action_list_statement = parsed.findAssignmentStatement({
    variableName: 'actions',
  });
  const luaActionsArrayIterator = parsed.extractArrayObjectDeclaration({
    statement: action_list_statement,
  });

  const spells: NoitaSpell[] = [];

  for (const luaSpell of luaActionsArrayIterator) {
    if (luaSpell['id'] === undefined || luaSpell['id'] === '') {
      throw new Error(
        'id is undefined or empty when extracting it from lua for spell ' +
          JSON.stringify(luaSpell),
      );
    }

    const spell: NoitaSpell = {
      id: luaSpell['id'] as string,
      name: luaSpell['name'] as string,
      description: luaSpell['description'] as string,
      imageBase64: '',
      type: luaSpell['type'] as string,

      maxUses: luaSpell['max_uses'] as number | undefined,
      price: luaSpell['price'] as number,
      manaDrain: luaSpell['mana'] as number,
      isDangerousBlast:
        (luaSpell['is_dangerous_blast'] as boolean | undefined) ?? false,
      neverUnlimited:
        (luaSpell['never_unlimited'] as boolean | undefined) ?? false,
      recursive: (luaSpell['recursive'] as boolean | undefined) ?? false,
      spawnRequiredFlag: luaSpell['spawn_required_flag'] as string | undefined,

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
    const spellName = trim({ text: spell.name, fromStart: '$' });
    const spellNameTranslation = translationsModel.tryGetTranslation(spellName);
    if (spellNameTranslation.exists) {
      spell.name = spellNameTranslation.translation.en;
    }

    const spellDescription = trim({
      text: spell.description,
      fromStart: '$',
    });
    const spellDescriptionTranslation =
      translationsModel.tryGetTranslation(spellDescription);
    if (spellDescriptionTranslation.exists) {
      spell.description = spellDescriptionTranslation.translation.en;
    }

    // load the image
    const sprite: string = luaSpell['sprite'] as string;
    const relativeImagePath = sprite.split('/').slice(1).join(path.sep);
    const imagePath = path.join(dataWakExtractedPath, relativeImagePath);
    spell.imageBase64 = await readImageAsBase64(imagePath);

    // load other data

    try {
      const xmlFiles = luaSpell['related_projectiles'];
      if (Array.isArray(xmlFiles)) {
        for (const xmlFile of xmlFiles) {
          if (typeof xmlFile !== 'string') continue;
          await scrapeXmlSpellData(dataWakExtractedPath, xmlFile, spell);
        }
      }
    } catch (e) {
      console.log('error', e);
      console.log('at spell', spell);
    }

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (damage in spell && spell[damage] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        spell[damage] *= NoitaConstants.damageMultiplier;
      }
    }

    const action = luaSpell['action'] as
      | StringKeyDictionary<SpellModifierUnit>
      | undefined;
    if (action) {
      spell.speedModifier = action['c.speed_multiplier'];
      spell.fireRateWaitModifier = action['c.fire_rate_wait'];
      spell.lifetimeModifier = action['c.lifetime_add'];
      spell.spreadDegreesModifier = action['c.spread_degrees'];
      spell.explosionDamageModifier = action['c.explosion_radius'];
      spell.explosionRadiusModifier = action['c.damage_explosion_add'];
      spell.iceDamageModifier = action['c.damage_ice_add'];
      spell.reloadTimeModifier = action['current_reload_time'];
      spell.recoilModifier = action['shot_effects.recoil_knockback'];
      // TODO: friendly fire
      // spell.friendlyFire = action['c.friendly_fire'];

      spell.projectileDamageModifier = action['c.damage_projectile_add'];
      if (spell.projectileDamageModifier) {
        spell.projectileDamageModifier.value *= NoitaConstants.damageMultiplier;
      }
    }

    spells.push(spell);
  }

  return spells;
};

const scrapeXmlSpellData = async (
  rootPath: string,
  xmlRelativePath: string,
  spell: NoitaSpell,
) => {
  const relativeXmlPath = xmlRelativePath.split('/').slice(1).join(path.sep);
  const xmlPath = path.join(rootPath, relativeXmlPath);

  if (!checkPathExist(xmlPath)) return spell;

  const xmlObj = await parseXmlFile(xmlPath);
  const xml = XmlWrapper(xmlObj);

  // this is in the main xml file
  const hitEffects = xml.findTagArray('HitEffectComponent');
  for (const hitEffect of hitEffects) {
    // specific for healhurt (Deadly Heal), in this xml will be the Regeneration Game effect
    const effect = hitEffect.getAttribute('value_string');
    if (effect?.endsWith('.xml')) {
      await scrapeXmlSpellData(rootPath, effect, spell);
    }
  }

  // this could come from the HitEffectComponent
  const gameEffects = xml.findTagArray('GameEffectComponent');
  for (const gameEffect of gameEffects) {
    const effect = gameEffect.getAttribute('effect');
    const frames = gameEffect.getAttributeNumber('frames');

    if (effect === 'REGENERATION' && frames > 0) {
      spell.regenerationFrames = frames;
    }
  }

  const lifetimeComponent = xml.findNthTag('LifetimeComponent');
  if (lifetimeComponent !== undefined) {
    spell.lifetime ??= lifetimeComponent.getAttributeNumber('lifetime');
  }

  const projectileComponent = xml.findNthTag('ProjectileComponent', 0);

  if (projectileComponent !== undefined) {
    spell.lifetime ??= projectileComponent.getAttributeNumber('lifetime');
    spell.lifetimeRandomness ??= projectileComponent.getAttributeNumber(
      'lifetime_randomness',
    );
    spell.projectileDamage ??= projectileComponent.getAttributeNumber('damage');

    spell.explosionDontDamageShooter =
      projectileComponent.getAttribute('explosion_dont_damage_shooter') === '1';
    spell.friendlyFire =
      projectileComponent.getAttribute('friendly_fire') === '1';

    const damageGameEffectEntities = trim({
      text:
        projectileComponent.getAttribute('damage_game_effect_entities') ?? '',
      fromEnd: ',',
    });
    if (damageGameEffectEntities?.endsWith('.xml')) {
      await scrapeXmlSpellData(rootPath, damageGameEffectEntities, spell);
    }

    const explosionConfig = projectileComponent.findNthTag(
      'config_explosion',
      0,
    );

    if (explosionConfig !== undefined) {
      spell.diggingPower ??= explosionConfig.getAttributeNumber('ray_energy');
      spell.explosionDamage ??= explosionConfig.getAttributeNumber('damage');
      spell.explosionRadius ??=
        explosionConfig.getAttributeNumber('explosion_radius');
    }

    const damageByType = projectileComponent.findNthTag('damage_by_type', 0);
    if (damageByType !== undefined) {
      spell.healingDamage ??= damageByType.getAttributeNumber('healing');
      spell.sliceDamage ??= damageByType.getAttributeNumber('slice');
      spell.meleeDamage ??= damageByType.getAttributeNumber('melee');
      spell.fireDamage ??= damageByType.getAttributeNumber('fire');
      spell.drillDamage ??= damageByType.getAttributeNumber('drill');
      spell.iceDamage ??= damageByType.getAttributeNumber('ice');
      spell.holyDamage ??= damageByType.getAttributeNumber('holy');
      spell.electricityDamage ??=
        damageByType.getAttributeNumber('electricity');
    }
  }

  return spell;
};

function proxiedPropertiesOf<TObj>(obj?: TObj) {
  // https://stackoverflow.com/questions/33547583/safe-way-to-extract-property-names
  return new Proxy(
    {},
    {
      get: (_, prop) => prop,
      set: () => {
        throw Error('Set not supported');
      },
    },
  ) as {
    [P in keyof TObj]?: P;
  };
}
