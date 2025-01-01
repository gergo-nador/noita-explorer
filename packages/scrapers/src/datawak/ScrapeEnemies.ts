import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
  NoitaEnemy,
  NoitaTranslation,
  noitaPaths,
  NoitaConstants,
  FileSystemFileAccess,
  NoitaEnemyGenomeData,
} from '@noita-explorer/model';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import {
  arrayHelpers,
  mathHelpers,
  stringHelpers,
} from '@noita-explorer/tools';
import { NoitaEnemyMaterialDamage } from '@noita-explorer/model';

export const scrapeEnemies = async ({
  dataWakDirectoryApi,
  translations,
}: {
  dataWakDirectoryApi: FileSystemDirectoryAccess;
  translations: StringKeyDictionary<NoitaTranslation>;
}): Promise<NoitaEnemy[]> => {
  const animalsDirPath = await dataWakDirectoryApi.path.join(
    noitaPaths.noitaDataWak.icons.animals,
  );
  const animalsDirectory =
    await dataWakDirectoryApi.getDirectory(animalsDirPath);

  const files = await animalsDirectory.listFiles();

  const animalsProcessQueue: { animalId: string; imageBase64: string }[] = [];
  let animalList: string[] = [];

  for (const file of files) {
    const filename = file.getName();
    const nameWithoutExtension = file.getNameWithoutExtension();

    if (filename === '_list.txt') {
      animalList = await file.read.asTextLines();

      continue;
    }

    const animalId = nameWithoutExtension;

    const imageBase64 = await file.read.asImageBase64();

    animalsProcessQueue.push({
      animalId: animalId,
      imageBase64: imageBase64,
    });
  }

  const animalsDataDirOath = await dataWakDirectoryApi.path.join(
    noitaPaths.noitaDataWak.xmlData.animals,
  );
  const animalsDataDirectory =
    await dataWakDirectoryApi.getDirectory(animalsDataDirOath);

  const noitaEnemies: NoitaEnemy[] = [];

  for (const animal of animalsProcessQueue) {
    try {
      let enemy = await scrapeEnemy(
        animal.animalId,
        animal.imageBase64,
        animalsDataDirectory,
        translations,
      );

      if (enemy === undefined) {
        enemy = {
          id: animal.animalId,
          imageBase64: animal.imageBase64,
          name:
            translations['animal_' + animal.animalId]?.en ?? animal.animalId,
          hp: undefined,
          bloodMaterial: undefined,
          materialsThatDamage: undefined,
        } as NoitaEnemy;
      }

      noitaEnemies.push(enemy);
    } catch (e) {
      throw new Error(
        'Error occured while scraping ' + animal.animalId + ' ' + e,
      );
    }
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

const scrapeEnemy = async (
  animalId: string,
  imageBase64: string,
  animalsDataDirectory: FileSystemDirectoryAccess,
  translations: StringKeyDictionary<NoitaTranslation>,
) => {
  const xmlFileName = animalId + '.xml';

  const file = await findFileInDirectory(xmlFileName, animalsDataDirectory);
  const xmlFileExists = file !== undefined;
  if (!xmlFileExists) {
    return undefined;
  }

  const xmlText = await file.read.asText();
  const xmlObj = await parseXml(xmlText);
  const xml = XmlWrapper(xmlObj);

  const entityTag = xml.findNthTag('Entity');
  if (entityTag === undefined) {
    return undefined;
  }

  const translationId = entityTag.getAttribute('name')?.asText();
  let entityName = translationId ?? animalId;

  if (translationId !== undefined) {
    const trimedTranslationId = stringHelpers.trim({
      text: translationId,
      fromStart: '$',
    });

    entityName = translations[trimedTranslationId]?.en ?? entityName;
  }

  const enemy: NoitaEnemy = {
    id: animalId,
    imageBase64: imageBase64,
    name: entityName,
    hp: undefined,
    bloodMaterial: undefined,
    materialsThatDamage: undefined,
    genomeData: undefined,
  };

  const damageModelComponent = entityTag.findNthTag('DamageModelComponent');
  if (damageModelComponent !== undefined) {
    const hp = damageModelComponent.getAttribute('hp')?.asFloat() ?? 0;
    enemy.hp = mathHelpers.round(hp * NoitaConstants.hpMultiplier, 2);

    const bloodMaterial = damageModelComponent
      .getAttribute('blood_material')
      ?.asText();
    enemy.bloodMaterial = bloodMaterial;

    const materialsThatDamage = damageModelComponent
      .getAttribute('materials_that_damage')
      ?.asText()
      ?.split(',');
    const materialsHowMuchDamage = damageModelComponent
      .getAttribute('materials_how_much_damage')
      ?.asText()
      ?.split(',');

    if (
      materialsThatDamage !== undefined &&
      materialsHowMuchDamage !== undefined &&
      materialsThatDamage.length === materialsHowMuchDamage.length
    ) {
      const damages = arrayHelpers
        .zip(materialsThatDamage, materialsHowMuchDamage)
        .map((materialDamage) => {
          const [materialName, damageMultiplier] = materialDamage;
          return {
            name: materialName,
            multiplier: parseFloat(damageMultiplier),
          } as NoitaEnemyMaterialDamage;
        });

      enemy.materialsThatDamage = damages;
    }
  }

  const genomeDataComponent = entityTag.findNthTag('GenomeDataComponent');
  if (genomeDataComponent !== undefined) {
    const genomeData: NoitaEnemyGenomeData = {
      herdId: genomeDataComponent
        .getRequiredAttribute('herd_id')
        .asText() as string,
      foodChainRank: genomeDataComponent
        .getRequiredAttribute('food_chain_rank')
        .asInt() as number,
      isPredator:
        genomeDataComponent.getRequiredAttribute('is_predator').asBoolean() ??
        false,
    };

    enemy.genomeData = genomeData;
  }

  return enemy;
};

const findFileInDirectory = async (
  fileName: string,
  directory: FileSystemDirectoryAccess,
): Promise<FileSystemFileAccess | undefined> => {
  const filePathExists = await directory.checkRelativePathExists(fileName);
  if (filePathExists) {
    return await directory.getFile(fileName);
  }

  const directories = await directory.listDirectories();
  for (const dir of directories) {
    const file = await findFileInDirectory(fileName, dir);
    if (file !== undefined) {
      return file;
    }
  }

  return undefined;
};
