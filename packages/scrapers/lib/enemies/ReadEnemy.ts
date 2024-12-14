import path from 'path';
import {
  getFilesFromFolder,
  readFileAsText,
  readImageAsBase64,
} from '../../utils/FileSystem';
import { NoitaEnemy, StringKeyDictionary } from '../../../common';
import { NoitaTranslationsModel } from '../NoitaTranslations';
import { noitaPaths } from '../NoitaPaths';
import { EOL } from 'os';

export const readEnemy = async ({
  dataWakExtractedPath,
  translationsModel,
}: {
  dataWakExtractedPath: string;
  translationsModel: NoitaTranslationsModel;
}): Promise<NoitaEnemy[]> => {
  const enemyFolder = path.join(
    dataWakExtractedPath,
    noitaPaths.noitaDataWak.icons.animals,
  );

  const files = await getFilesFromFolder(enemyFolder);
  const noitaEnemies: NoitaEnemy[] = [];

  let list: string[] = [];

  for (const file of files) {
    const parsed = path.parse(file);
    const filename = parsed.base;
    const nameWithoutExtension = parsed.name;

    if (filename === '_list.txt') {
      const listPath = path.join(
        dataWakExtractedPath,
        noitaPaths.noitaDataWak.icons.animals,
        filename,
      );
      const listTxt = await readFileAsText(listPath);
      list = listTxt.split(EOL);

      continue;
    }

    const animalId = nameWithoutExtension;
    const missingTranslationNames: StringKeyDictionary<string> = {
      miner_chef: 'Kokkihiisi',
      basebot_sentry: 'Tarkkailija',
      basebot_hidden: 'Vakoilija',
      basebot_neutralizer: 'Pysäyttäjä',
      basebot_soldier: 'Teloittaja',
    };

    let animalName: string = '__empty__' + animalId;
    const translationId = 'animal_' + animalId;
    const translationResult =
      translationsModel.tryGetTranslation(translationId);

    if (translationResult.exists) {
      animalName = translationResult.translation.en;
    } else if (animalId in missingTranslationNames) {
      animalName = missingTranslationNames[animalId];
    } else {
      animalName = '__not_found__' + animalId;
    }

    const imagePath = path.join(
      dataWakExtractedPath,
      noitaPaths.noitaDataWak.icons.animals,
      file,
    );
    const imageBase64 = await readImageAsBase64(imagePath);

    noitaEnemies.push({
      id: animalId,
      name: animalName,
      imageBase64: imageBase64,
    });
  }

  // first sort by abc
  //noitaEnemies.sort((a, b) => a.name.localeCompare(b.name));
  // then sort by the list
  noitaEnemies.sort((a, b) => {
    let index1 = list.indexOf(a.id);
    let index2 = list.indexOf(b.id);

    if (index1 === -1) index1 = list.length;
    if (index2 === -1) index2 = list.length;

    return index1 - index2;
  });

  return noitaEnemies;
};
