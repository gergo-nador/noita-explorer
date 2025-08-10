import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import {
  NoitaScrapedPerk,
  NoitaTranslation,
} from '@noita-explorer/model-noita';
import { stringHelpers } from '@noita-explorer/tools';
import { LuaWrapper } from '@noita-explorer/tools/lua';
import { noitaPaths } from '../../noita-paths.ts';

export const scrapePerks = async ({
  dataWakParentDirectoryApi,
  translations,
}: {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
  translations: StringKeyDictionary<NoitaTranslation>;
}): Promise<NoitaScrapedPerk[]> => {
  const perkListLuaScriptPath = await dataWakParentDirectoryApi.path.join(
    noitaPaths.noitaDataWak.luaScripts.perks,
  );
  const perkListLuaScriptFile = await dataWakParentDirectoryApi.getFile(
    perkListLuaScriptPath,
  );

  const text = await perkListLuaScriptFile.read.asText();
  const parsed = LuaWrapper(text);

  const perkListStatement = parsed
    .findTopLevelAssignmentStatement('perk_list')
    .first();
  const luaPerkArray = perkListStatement.asArrayObjectDeclarationList();

  const perks: NoitaScrapedPerk[] = [];

  for (const luaPerk of luaPerkArray) {
    const perk: NoitaScrapedPerk = {
      id: luaPerk.getRequiredField('id').required.asString().toLowerCase(),
      name: luaPerk.getRequiredField('ui_name').required.asString(),
      description: luaPerk
        .getRequiredField('ui_description')
        .required.asString(),
      imageBase64: '',

      // stacking
      stackableIsRare:
        luaPerk.getField('stackable_is_rare')?.asBoolean() ?? false,
      stackable:
        luaPerk.getField('stackable')?.asIdentifier() === 'STACKABLE_YES',
      stackableMaximum: luaPerk.getField('stackable_maximum')?.asNumber(),
      stackableHowOftenReappears: luaPerk
        .getField('stackable_how_often_reappears')
        ?.asNumber(),

      // perk pool
      maxInPerkPool: luaPerk.getField('max_in_perk_pool')?.asNumber(),
      notInDefaultPerkPool:
        luaPerk.getField('not_in_default_perk_pool')?.asBoolean() ?? false,
      // others
      doNotRemove: luaPerk.getField('do_not_remove')?.asBoolean() ?? false,
      oneOffEffect: luaPerk.getField('one_off_effect')?.asBoolean() ?? false,
      usableByEnemies:
        luaPerk.getField('usable_by_enemies')?.asBoolean() ?? false,
      gameEffects: [],
    };

    // add the game effects
    for (const key of luaPerk.keys) {
      if (key.startsWith('game_effect')) {
        const gameEffect = luaPerk
          .getRequiredField(key)
          .required.asString()
          .toUpperCase();

        perk.gameEffects.push(gameEffect);
      }
    }

    // Load the translation
    const perkNameId = stringHelpers.trim({ text: perk.name, fromStart: '$' });
    const perkNameTranslation = translations[perkNameId];
    if (perkNameTranslation) {
      perk.name = perkNameTranslation.en;
    }

    const perkDescription = stringHelpers.trim({
      text: perk.description,
      fromStart: '$',
    });
    const perkDescriptionTranslation = translations[perkDescription];
    if (perkDescriptionTranslation) {
      perk.description = perkDescriptionTranslation.en;
    }

    // load the image
    const ui_icon = luaPerk.getRequiredField('perk_icon').required.asString();
    const imagePath = await dataWakParentDirectoryApi.path.join(
      ui_icon.split('/'),
    );
    const imageFile = await dataWakParentDirectoryApi.getFile(imagePath);
    perk.imageBase64 = await imageFile.read.asImageBase64();

    perks.push(perk);
  }

  return perks;
};
