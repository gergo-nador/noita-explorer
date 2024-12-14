import { noitaPaths } from '../NoitaPaths';
import path from 'path';
import { readFileAsText, readImageAsBase64 } from '../../utils/FileSystem';
import { NoitaTranslationsModel } from '../NoitaTranslations';
import { NoitaPerk } from '../../../common';
import { trim } from '../../utils/StringUtils';
import { parseLua } from '../../utils/LuaUtils';

export const readPerks = async ({
  dataWakExtractedPath,
  translationsModel,
}: {
  dataWakExtractedPath: string;
  translationsModel: NoitaTranslationsModel;
}): Promise<NoitaPerk[]> => {
  const perk_list_path = path.join(
    dataWakExtractedPath,
    noitaPaths.noitaDataWak.luaScripts.perks,
  );

  const text = await readFileAsText(perk_list_path);
  const parsed = parseLua({ text });

  const perk_list_statement = parsed.findAssignmentStatement({
    variableName: 'perk_list',
  });
  const luaPerkArrayIterator = parsed.extractArrayObjectDeclaration({
    statement: perk_list_statement,
  });

  const perks: NoitaPerk[] = [];

  for (const luaPerk of luaPerkArrayIterator) {
    if (luaPerk['id'] === undefined) {
      throw new Error(
        'id is undefined when extracting it from lua for perk ' +
          JSON.stringify(luaPerk),
      );
    }

    const perk: NoitaPerk = {
      id: luaPerk['id'] as string,
      name: luaPerk['ui_name'] as string,
      description: luaPerk['ui_description'] as string,
      imageBase64: '',

      // stacking
      stackableIsRare: (luaPerk['stackable_is_rare'] as boolean) ?? false,
      stackable: luaPerk['stackable'] === 'STACKABLE_YES',
      stackableMaximum: luaPerk['stackable_maximum'] as number | undefined,
      stackableHowOftenReappears: luaPerk['stackable_how_often_reappears'] as
        | number
        | undefined,

      // perk pool
      maxInPerkPool: luaPerk['max_in_perk_pool'] as number | undefined,
      notInDefaultPerkPool:
        (luaPerk['not_in_default_perk_pool'] as boolean) ?? false,

      // others
      doNotRemove: (luaPerk['do_not_remove'] as boolean) ?? false,
      oneOffEffect: (luaPerk['one_off_effect'] as boolean) ?? false,
      usableByEnemies: (luaPerk['usable_by_enemies'] as boolean) ?? false,
      gameEffects: [],
    };

    // add the game effects
    for (const key in luaPerk) {
      if (key.startsWith('game_effect')) {
        const gameEffect = luaPerk[key] as string;
        perk.gameEffects.push(gameEffect);
      }
    }

    // Load the translation
    const perkNameId = trim({ text: perk.name, fromStart: '$' });
    const perkNameTranslation = translationsModel.tryGetTranslation(perkNameId);
    if (perkNameTranslation.exists) {
      perk.name = perkNameTranslation.translation.en;
    }

    const perkDescription = trim({
      text: perk.description,
      fromStart: '$',
    });
    const perkDescriptionTranslation =
      translationsModel.tryGetTranslation(perkDescription);
    if (perkDescriptionTranslation.exists) {
      perk.description = perkDescriptionTranslation.translation.en;
    }
    // load the image
    const ui_icon: string = luaPerk['perk_icon'] as string;
    const relativePath = ui_icon.split('/').slice(1).join(path.sep);
    const imagePath = path.join(dataWakExtractedPath, relativePath);
    perk.imageBase64 = await readImageAsBase64(imagePath);

    perks.push(perk);
  }

  return perks;
};
