import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
  NoitaEnemy,
  NoitaEnemyVariant,
  NoitaEnemyMaterialDamage,
  NoitaTranslation,
  noitaPaths,
  NoitaConstants,
  FileSystemFileAccess,
  NoitaEnemyGenomeData,
} from '@noita-explorer/model';
import {
  parseXml,
  XmlWrapper,
  XmlWrapperType,
} from '@noita-explorer/tools/xml';
import {
  arrayHelpers,
  mathHelpers,
  stringHelpers,
} from '@noita-explorer/tools';

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
  // TODO: rework this scraper so that it starts at the bottom of
  //  the Base object and overwrites the values as it up down in the hierarchy

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

    const translationIdFromAnimalId = 'animal_' + animalId;
    if (translationIdFromAnimalId in translations) {
      entityName = translations[translationIdFromAnimalId].en;
    } else if (trimedTranslationId in translations) {
      entityName = translations[trimedTranslationId].en;
    }
  }

  const enemy: NoitaEnemy = {
    id: animalId,
    imageBase64: imageBase64,
    name: entityName,
    hp: undefined,
    maxHp: undefined,
    knockBackResistance: undefined,
    bloodMaterial: undefined,
    materialsThatDamage: undefined,
    genomeData: undefined,
    goldDrop: true,
    variants: [],
  };

  const damageModelComponent = entityTag.findNthTag('DamageModelComponent');
  if (damageModelComponent !== undefined) {
    const extracted = extractDamageModelInformation(damageModelComponent);
    enemy.hp = extracted.hp;
    enemy.maxHp = extracted.maxHp;
    enemy.bloodMaterial = extracted.bloodMaterial;
    enemy.materialsThatDamage = extracted.damages;
    enemy.knockBackResistance = extracted.knockBackResistance;
  }

  const genomeDataComponent = entityTag.findNthTag('GenomeDataComponent');
  if (genomeDataComponent !== undefined) {
    const genomeData: NoitaEnemyGenomeData = {
      herdId: genomeDataComponent.getAttribute('herd_id')?.asText(),
      foodChainRank: genomeDataComponent
        .getAttribute('food_chain_rank')
        ?.asInt(),
      isPredator:
        genomeDataComponent.getAttribute('is_predator')?.asBoolean() ?? false,
    };

    enemy.genomeData = genomeData;
  }

  const subDirectories = await animalsDataDirectory.listDirectories();
  const variantFiles = await findAllFilesInDirectory(
    xmlFileName,
    subDirectories,
  );

  const variableStorageComponent = entityTag.findNthTag(
    'VariableStorageComponent',
  );
  if (variableStorageComponent !== undefined) {
    const tags = variableStorageComponent
      .getAttribute('_tags')
      ?.asText()
      ?.split(',');

    if (tags !== undefined && tags.includes('no_gold_drop')) {
      enemy.goldDrop = false;
    }
  }

  for (const variantFile of variantFiles) {
    /*
    variant file for scavenger_heal:

    <Entity >
      <Base file="data/entities/animals/scavenger_heal.xml"  include_children="1">
        <DamageModelComponent
          hp="0.7"
          max_hp="0.7"
    	  minimum_knockback_force="100000"
         ></DamageModelComponent >
      </Base>
    </Entity>

    might be worth implementing the Base file check and build a file tree to extract the variants more accurately
     */

    const variantFullPath = variantFile.getFullPath();
    if (variantFullPath === file?.getFullPath()) {
      continue;
    }

    const variantFullPathSplit =
      await animalsDataDirectory.path.split(variantFullPath);

    const variantXmlText = await variantFile.read.asText();
    const variantXmlObj = await parseXml(variantXmlText);
    const variantXmlWrapper = XmlWrapper(variantXmlObj);

    const variantEntity = variantXmlWrapper.findNthTag('Entity');
    if (variantEntity === undefined) {
      continue;
    }

    const variant: NoitaEnemyVariant = {
      // the biome is the folder right before the file name
      biome: variantFullPathSplit[variantFullPathSplit.length - 2],
      hp: undefined,
      maxHp: undefined,
      knockBackResistance: undefined,
    };

    const variantDamageModelComponent = variantEntity.findNthTag(
      'DamageModelComponent',
    );
    if (variantDamageModelComponent !== undefined) {
      const extracted = extractDamageModelInformation(
        variantDamageModelComponent,
      );
      variant.hp = extracted.hp;
      variant.maxHp = extracted.maxHp;
      variant.knockBackResistance = extracted.knockBackResistance;
    }

    enemy.variants.push(variant);
  }

  return enemy;
};

const extractDamageModelInformation = (
  damageModelComponent: XmlWrapperType,
) => {
  let hp = damageModelComponent.getAttribute('hp')?.asFloat();
  if (hp !== undefined) {
    hp = mathHelpers.round(hp * NoitaConstants.hpMultiplier, 2);
  }

  let maxHp = damageModelComponent.getAttribute('max_hp')?.asFloat();
  if (maxHp !== undefined) {
    maxHp = mathHelpers.round(maxHp * NoitaConstants.hpMultiplier, 2);
  }

  const bloodMaterial = damageModelComponent
    .getAttribute('blood_material')
    ?.asText();

  const materialsThatDamage = damageModelComponent
    .getAttribute('materials_that_damage')
    ?.asText()
    ?.split(',');
  const materialsHowMuchDamage = damageModelComponent
    .getAttribute('materials_how_much_damage')
    ?.asText()
    ?.split(',');

  const hasDamageMaterialsAttributes =
    materialsThatDamage !== undefined &&
    materialsHowMuchDamage !== undefined &&
    materialsThatDamage.length === materialsHowMuchDamage.length;

  const damages = hasDamageMaterialsAttributes
    ? arrayHelpers
        .zip(materialsThatDamage, materialsHowMuchDamage)
        .map((materialDamage) => {
          const [materialName, damageMultiplier] = materialDamage;
          return {
            name: materialName,
            multiplier: parseFloat(damageMultiplier),
          } as NoitaEnemyMaterialDamage;
        })
    : undefined;

  const knockBackResistance = damageModelComponent
    .getAttribute('minimum_knockback_force')
    ?.asInt();

  return {
    hp,
    maxHp,
    bloodMaterial,
    damages,
    knockBackResistance,
  };
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

const findAllFilesInDirectory = async (
  fileName: string,
  directories: FileSystemDirectoryAccess[],
): Promise<FileSystemFileAccess[]> => {
  const arr: FileSystemFileAccess[] = [];

  let directoryQueue: FileSystemDirectoryAccess[] = [...directories];

  while (directoryQueue.length > 0) {
    const currentDir = directoryQueue.shift()!;
    const filePathExists = await currentDir.checkRelativePathExists(fileName);
    if (filePathExists) {
      const file = await currentDir.getFile(fileName);
      arr.push(file);
    }

    const subDirectories = await currentDir.listDirectories();
    directoryQueue = [...directoryQueue, ...subDirectories];
  }

  return arr;
};
