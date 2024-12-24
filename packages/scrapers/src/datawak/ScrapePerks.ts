import {
  FileSystemFolderBrowserApi,
  NoitaPerk,
  StringKeyDictionary,
  NoitaTranslation,
  noitaPaths,
} from '@noita-explorer/model';
import { LuaWrapper, stringHelpers } from '@noita-explorer/tools';

export const scrapePerks = async ({
  dataWakFolderBrowserApi,
  translations,
}: {
  dataWakFolderBrowserApi: FileSystemFolderBrowserApi;
  translations: StringKeyDictionary<NoitaTranslation>;
}): Promise<NoitaPerk[]> => {
  const perkListLuaScriptPath = await dataWakFolderBrowserApi.path.join(
    noitaPaths.noitaDataWak.luaScripts.perks,
  );
  const perkListLuaScriptFile = await dataWakFolderBrowserApi.getFile(
    perkListLuaScriptPath,
  );

  const text = await perkListLuaScriptFile.read.asText();
  const parsed = LuaWrapper(text);

  const perkListStatement = parsed
    .findTopLevelAssignmentStatement('perk_list')
    .first();
  const luaPerkArray = perkListStatement.asArrayObjectDeclarationList();

  const perks: NoitaPerk[] = [];

  for (const luaPerk of luaPerkArray) {
    const perk: NoitaPerk = {
      id: luaPerk.getRequiredField('id').required.asString(),
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
    const imagePath = await dataWakFolderBrowserApi.path.join(
      ui_icon.split('/'),
    );
    const imageFile = await dataWakFolderBrowserApi.getFile(imagePath);
    perk.imageBase64 = await imageFile.read.asImageBase64();

    perks.push(perk);
  }

  return perks;
};
