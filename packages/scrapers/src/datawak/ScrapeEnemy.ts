import {
  FileSystemFolderBrowserApi,
  StringKeyDictionary,
  NoitaEnemy,
  NoitaTranslation,
  noitaPaths,
} from '@noita-explorer/model';

export const scrapeEnemy = async ({
  dataWakFolderBrowserApi,
  translations,
}: {
  dataWakFolderBrowserApi: FileSystemFolderBrowserApi;
  translations: StringKeyDictionary<NoitaTranslation>;
}): Promise<NoitaEnemy[]> => {
  const animalsFolderPath = await dataWakFolderBrowserApi.path.join(
    noitaPaths.noitaDataWak.icons.animals,
  );
  const animalsFolder =
    await dataWakFolderBrowserApi.getFolder(animalsFolderPath);

  const files = await animalsFolder.listFilesFromFolder();
  const noitaEnemies: NoitaEnemy[] = [];

  let animalList: string[] = [];

  for (const file of files) {
    const filename = file.getName();
    const nameWithoutExtension = file.getNameWithoutExtension();

    if (filename === '_list.txt') {
      animalList = await file.read.asTextLines();

      continue;
    }

    const animalId = nameWithoutExtension;
    const missingTranslationNames: StringKeyDictionary<string> = {
      miner_chef: 'Kokkihiisi',
      basebot_sentry: 'Tarkkailija',
      basebot_hidden: 'Vakoilija',
      basebot_neutralizer: 'Pysäyttäjä',
      basebot_soldier: 'Teloittaja',
      roboguard_big: 'Kyrmyniska',
    };

    let animalName: string;
    const translationId = 'animal_' + animalId;
    const translationResult = translations[translationId];

    if (translationResult) {
      animalName = translationResult.en;
    } else if (animalId in missingTranslationNames) {
      animalName = missingTranslationNames[animalId];
    } else {
      animalName = '__not_found__' + animalId;
    }

    const imageBase64 = await file.read.asImageBase64();

    noitaEnemies.push({
      id: animalId,
      name: animalName,
      imageBase64: imageBase64,
    });
  }

  // sort by the animal list
  noitaEnemies.sort((a, b) => {
    let index1 = animalList.indexOf(a.id);
    let index2 = animalList.indexOf(b.id);

    if (index1 === -1) index1 = animalList.length;
    if (index2 === -1) index2 = animalList.length;

    return index1 - index2;
  });

  return noitaEnemies;
};
