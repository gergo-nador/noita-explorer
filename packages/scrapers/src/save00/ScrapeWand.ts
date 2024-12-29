import { XmlWrapperType } from '@noita-explorer/tools/xml';
import { NoitaWand } from '@noita-explorer/model';

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

  return wand;
};
