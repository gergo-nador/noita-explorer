import { XmlWrapperType } from '@noita-explorer/tools/xml';
import { NoitaWand, NoitaWandSpell } from '@noita-explorer/model-noita';

// used privately by this package
export const __scrapeWand = (wandXml: XmlWrapperType) => {
  const tags = wandXml.getAttribute('tags')?.asText();
  if (tags === undefined || !tags.split(',').includes('wand')) {
    return undefined;
  }

  const abilityComponent = wandXml.findNthTag('AbilityComponent');
  if (abilityComponent === undefined) {
    return undefined;
  }

  const gunConfig = abilityComponent.findNthTag('gun_config');
  if (gunConfig === undefined) {
    return undefined;
  }

  const gunActionConfig = abilityComponent.findNthTag('gunaction_config');
  if (gunActionConfig === undefined) {
    return undefined;
  }

  const wand: NoitaWand = {
    name: abilityComponent.getRequiredAttribute('ui_name').asText() ?? 'Wand',
    spriteId: '_',

    mana: abilityComponent.getRequiredAttribute('mana').asInt() ?? -1,
    manaChargeSpeed:
      abilityComponent.getRequiredAttribute('mana_charge_speed').asInt() ?? -1,
    manaMax: abilityComponent.getRequiredAttribute('mana_max').asInt() ?? -1,

    deckCapacity: gunConfig.getRequiredAttribute('deck_capacity').asInt() ?? -1,
    actionsPerRound:
      gunConfig.getRequiredAttribute('actions_per_round').asInt() ?? -1,
    reloadTime: gunConfig.getRequiredAttribute('reload_time').asInt() ?? -1,
    fireRateWait:
      gunActionConfig.getRequiredAttribute('fire_rate_wait').asInt() ?? -1,
    shuffle:
      gunConfig.getRequiredAttribute('shuffle_deck_when_empty').asBoolean() ??
      false,

    speedMultiplier:
      gunActionConfig.getRequiredAttribute('speed_multiplier').asFloat() ?? -1,
    spreadMultiplier:
      gunActionConfig.getRequiredAttribute('spread_degrees').asInt() ?? 0,

    alwaysCastSpells: [],
    spells: [],
    spellsPossibleIncorrectOrder: false,
  };

  const spritePath = abilityComponent
    .getRequiredAttribute('sprite_file')
    .asText()
    ?.split('/');

  if (spritePath !== undefined) {
    const spriteFile = spritePath[spritePath.length - 1];
    const spriteFileSplit = spriteFile.split('.');

    wand.spriteId = spriteFileSplit[0];
  }

  const entities = wandXml.findTagArray('Entity');
  for (const entity of entities) {
    const entityTags = entity.getAttribute('tags')?.asText()?.split(',');
    if (entityTags === undefined || !entityTags.includes('card_action')) {
      continue;
    }

    const itemActionComponent = entity.findNthTag('ItemActionComponent');
    if (itemActionComponent === undefined) {
      continue;
    }

    const itemComponent = entity.findNthTag('ItemComponent');
    if (itemComponent === undefined) {
      continue;
    }

    const spellId = itemActionComponent
      .getRequiredAttribute('action_id')
      .asText() as string;

    let inventorySlot = itemComponent
      .getRequiredAttribute('inventory_slot.x')
      .asInt() as number;

    const isAlwaysCastSpell =
      itemComponent.getAttribute('permanently_attached')?.asBoolean() ?? false;

    if (isAlwaysCastSpell) {
      const wandSpellAlwaysCast: NoitaWandSpell = {
        spellId: spellId,
        inventorySlot: wand.alwaysCastSpells.length,
        usesRemaining: undefined,
      };

      wand.alwaysCastSpells.push(wandSpellAlwaysCast);
      continue;
    }

    // check if the inventory slot is already taken (it can happen)
    if (
      wand.spells.find((s) => s.inventorySlot === inventorySlot) !== undefined
    ) {
      wand.spellsPossibleIncorrectOrder = true;

      for (let i = 0; i < wand.deckCapacity; i++) {
        if (wand.spells.every((s) => s.inventorySlot !== i)) {
          // assign the first available inventory slot
          inventorySlot = i;
          break;
        }
      }
    }

    const usesRemaining = itemComponent.getAttribute('uses_remaining')?.asInt();

    const wandSpell: NoitaWandSpell = {
      spellId: spellId,
      inventorySlot: inventorySlot,
      usesRemaining: usesRemaining,
    };

    wand.spells.push(wandSpell);
  }

  return wand;
};
