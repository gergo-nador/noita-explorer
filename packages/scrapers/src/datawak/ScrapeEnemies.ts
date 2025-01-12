import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import {
  NoitaConstants,
  NoitaEnemy,
  NoitaEnemyGameEffect,
  NoitaEnemyMaterialDamage,
  NoitaEnemyVariant,
  NoitaTranslation,
} from '@noita-explorer/model-noita';
import {
  parseXml,
  XmlWrapper,
  XmlWrapperType,
} from '@noita-explorer/tools/xml';
import {
  arrayHelpers,
  fileSystemAccessHelpers,
  mathHelpers,
  stringHelpers,
  objectHelpers,
} from '@noita-explorer/tools';
import { noitaPaths } from '../NoitaPaths.ts';

/**
 * Scraping all the enemies/animals
 * @param dataWakParentDirectoryApi
 * @param translations
 */
export const scrapeEnemies = async ({
  dataWakParentDirectoryApi,
  translations,
}: {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
  translations: StringKeyDictionary<NoitaTranslation>;
}): Promise<NoitaEnemy[]> => {
  // Part 1: Getting a list of animal ids and their corresponding images
  const animalsDirPath = await dataWakParentDirectoryApi.path.join(
    noitaPaths.noitaDataWak.icons.animals,
  );
  const animalsDirectory =
    await dataWakParentDirectoryApi.getDirectory(animalsDirPath);

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

  const animalsDataDirOath = await dataWakParentDirectoryApi.path.join(
    noitaPaths.noitaDataWak.xmlData.animals,
  );
  const animalsDataDirectory =
    await dataWakParentDirectoryApi.getDirectory(animalsDataDirOath);

  const noitaEnemies: NoitaEnemy[] = [];

  for (const animal of animalsProcessQueue) {
    try {
      const defaultName = translations['animal_' + animal.animalId]?.en;
      const defaultDamageMultiplier = 1;

      const enemy: NoitaEnemy = {
        id: animal.animalId,
        imageBase64: animal.imageBase64,
        name: defaultName ?? animal.animalId,
        hp: undefined,
        maxHp: undefined,
        airNeeded: undefined,
        bloodMaterial: undefined,
        ragdollMaterial: undefined,
        fireProbabilityOfIgnition: undefined,
        materialsThatDamage: undefined,
        goldDrop: undefined,
        hasGoldDrop: false,
        genomeData: undefined,
        physicsObjectsDamage: undefined,
        knockBackResistance: undefined,
        damageMultipliers: {
          ice: defaultDamageMultiplier,
          fire: defaultDamageMultiplier,
          holy: defaultDamageMultiplier,
          drill: defaultDamageMultiplier,
          slice: defaultDamageMultiplier,
          melee: defaultDamageMultiplier,
          explosion: defaultDamageMultiplier,
          projectile: defaultDamageMultiplier,
          electricity: defaultDamageMultiplier,
          radioactive: defaultDamageMultiplier,
        },
        variants: [],
        gameEffects: [],
        entityTags: [],
      };

      await scrapeEnemyMain({
        enemy: enemy,
        translations: translations,
        animalsDataDirectory: animalsDataDirectory,
        dataWakParentDirectoryApi: dataWakParentDirectoryApi,
      });

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

const scrapeEnemyMain = async ({
  enemy,
  dataWakParentDirectoryApi,
  translations,
  animalsDataDirectory,
}: {
  enemy: NoitaEnemy;
  translations: StringKeyDictionary<NoitaTranslation>;
  animalsDataDirectory: FileSystemDirectoryAccess;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}) => {
  // Find, read and parse the enemy file
  const xmlFileName = enemy.id + '.xml';

  const file = await fileSystemAccessHelpers.findFileInDirectory(
    xmlFileName,
    animalsDataDirectory,
  );
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

  // get the translation id
  const translationId = entityTag.getAttribute('name')?.asText();
  let entityName = translationId ?? enemy.id;

  if (translationId !== undefined) {
    const trimedTranslationId = stringHelpers.trim({
      text: translationId,
      fromStart: '$',
    });

    const translationIdFromAnimalId = 'animal_' + enemy.id;
    if (translationIdFromAnimalId in translations) {
      entityName = translations[translationIdFromAnimalId].en;
    } else if (trimedTranslationId in translations) {
      entityName = translations[trimedTranslationId].en;
    }
  }

  enemy.name = entityName;

  // before starting to extract properties for enemy,
  // traverse through the Base tag hierarchy
  await traverseThroughBaseFiles({
    enemy: enemy,
    file: file,
    dataWakParentDirectoryApi: dataWakParentDirectoryApi,
  });

  // then extract the more specific properties for the enemy
  extractEnemyProperties({ enemy, entityTag });

  // dropped gold

  if (enemy.hasGoldDrop) {
    const enemyHpForGold = enemy.maxHp ?? enemy.hp;
    if (enemyHpForGold !== undefined) {
      enemy.goldDrop = calculateGold(enemyHpForGold);
    }
  }

  // look for variants
  const subDirectories = await animalsDataDirectory.listDirectories();
  const variantFiles = await fileSystemAccessHelpers.findAllFilesInDirectory(
    xmlFileName,
    subDirectories,
  );

  for (const variantFile of variantFiles) {
    const variantFullPath = variantFile.getFullPath();
    if (variantFullPath === file?.getFullPath()) {
      continue;
    }

    const variantFullPathSplit =
      await animalsDataDirectory.path.split(variantFullPath);

    const variantXmlText = await variantFile.read.asText();
    const variantXmlObj = await parseXml(variantXmlText);
    const variantXmlWrapper = XmlWrapper(variantXmlObj);

    const variantEntityTag = variantXmlWrapper.findNthTag('Entity');
    if (variantEntityTag === undefined) {
      continue;
    }

    const variant: NoitaEnemyVariant = {
      // the variant id is the folder right before the file name
      variantId: variantFullPathSplit[variantFullPathSplit.length - 2],
      enemy: objectHelpers.deepCopy(enemy),
    };

    extractEnemyProperties({
      enemy: variant.enemy,
      entityTag: variantEntityTag,
    });

    enemy.variants.push(variant);
  }

  return enemy;
};

/**
 * Traverses through the hierarchy tree of base definitions
 * @param enemy the enemy object to fill up
 * @param file the current base file
 * @param dataWakParentDirectoryApi
 */
const traverseThroughBaseFiles = async ({
  enemy,
  file,
  dataWakParentDirectoryApi,
}: {
  enemy: NoitaEnemy;
  file: FileSystemFileAccess;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}) => {
  const xmlText = await file.read.asText().then(parseXml);
  const xml = XmlWrapper(xmlText);

  const entityTag = xml.findNthTag('Entity');
  if (entityTag === undefined) {
    return;
  }

  const baseTag = entityTag.findNthTag('Base');
  const baseFilePath = baseTag?.getAttribute('file')?.asText();
  if (baseTag !== undefined && baseFilePath !== undefined) {
    const baseFileExists =
      await dataWakParentDirectoryApi.checkRelativePathExists(baseFilePath);

    if (baseFileExists) {
      const baseFile = await dataWakParentDirectoryApi.getFile(baseFilePath);
      await traverseThroughBaseFiles({
        enemy: enemy,
        file: baseFile,
        dataWakParentDirectoryApi: dataWakParentDirectoryApi,
      });
    }
  }

  extractEnemyProperties({ enemy, entityTag });
};

/**
 * Extracts XML information of enemies/animals, overwriting the properties
 * in case if the data is present in the XML data
 * @param enemy
 * @param entityTag
 */
const extractEnemyProperties = ({
  enemy,
  entityTag,
}: {
  enemy: NoitaEnemy;
  entityTag: XmlWrapperType;
}) => {
  const tags = entityTag.getAttribute('tags')?.asText();
  if (tags !== undefined) {
    const splitted = splitTags(tags);
    enemy.entityTags = arrayHelpers.unique([...enemy.entityTags, ...splitted]);
  }

  const damageModelComponent = entityTag.findNthTag('DamageModelComponent');
  if (damageModelComponent !== undefined) {
    const extracted = extractDamageModelInformation(damageModelComponent);
    enemy.hp = extracted.hp ?? enemy.hp;
    enemy.maxHp = extracted.maxHp ?? enemy.maxHp;
    enemy.bloodMaterial = extracted.bloodMaterial ?? enemy.bloodMaterial;
    enemy.materialsThatDamage = extracted.damages ?? enemy.materialsThatDamage;
    enemy.knockBackResistance =
      extracted.knockBackResistance ?? enemy.knockBackResistance;
    enemy.airNeeded = extracted.airNeeded ?? enemy.airNeeded;
    enemy.ragdollMaterial = extracted.ragdollMaterial ?? enemy.ragdollMaterial;
    enemy.fireProbabilityOfIgnition =
      extracted.fireProbabilityOfIgnition ?? enemy.fireProbabilityOfIgnition;
    enemy.physicsObjectsDamage =
      extracted.physicsObjectsDamage ?? enemy.physicsObjectsDamage;
  }

  const genomeDataComponent = entityTag.findNthTag('GenomeDataComponent');
  if (genomeDataComponent !== undefined) {
    const herdId = genomeDataComponent.getAttribute('herd_id')?.asText();

    const foodChainRank = genomeDataComponent
      .getAttribute('food_chain_rank')
      ?.asInt();

    const isPredator = genomeDataComponent
      .getAttribute('is_predator')
      ?.asBoolean();

    if (enemy.genomeData === undefined) {
      enemy.genomeData = {
        herdId: undefined,
        isPredator: undefined,
        foodChainRank: undefined,
      };
    }

    enemy.genomeData.herdId = herdId ?? enemy.genomeData.herdId;
    enemy.genomeData.foodChainRank =
      foodChainRank ?? enemy.genomeData.foodChainRank;
    enemy.genomeData.isPredator = isPredator ?? enemy.genomeData.isPredator;
  }

  const luaComponents = entityTag.findAllTagsRecursively('LuaComponent');
  for (const luaComponent of luaComponents) {
    const goldDropScript = 'data/scripts/items/drop_money.lua';
    const scriptDeath = luaComponent.getAttribute('script_death')?.asText();

    if (scriptDeath !== undefined && scriptDeath === goldDropScript) {
      enemy.hasGoldDrop = true;
    }
  }

  const variableStorageComponent = entityTag.findNthTag(
    'VariableStorageComponent',
  );
  if (variableStorageComponent !== undefined) {
    const tags = variableStorageComponent
      .getAttribute('_tags')
      ?.asText()
      ?.split(',');

    if (tags !== undefined && tags.includes('no_gold_drop')) {
      enemy.hasGoldDrop = true;
    }
  }

  const gameEffectComponents = entityTag.findAllTagsRecursively(
    'GameEffectComponent',
  );
  for (const gameEffectComponent of gameEffectComponents) {
    const effectId = gameEffectComponent
      .getRequiredAttribute('effect')
      .asText()!;
    const frames = gameEffectComponent.getAttribute('frames')?.asInt() ?? 0;

    const gameEffect: NoitaEnemyGameEffect = {
      id: effectId,
      frames: frames,
    };

    if (enemy.gameEffects.some((effect) => effect.id === effectId)) {
      continue;
    }
    enemy.gameEffects.push(gameEffect);
  }

  const damageMultipliersTag =
    damageModelComponent?.findNthTag('damage_multipliers');
  const damageMultiplierProxy = objectHelpers.proxiedPropertiesOf(
    enemy.damageMultipliers,
  );
  if (damageMultipliersTag !== undefined) {
    const extractDamageMultipliers = [
      damageMultiplierProxy.ice,
      damageMultiplierProxy.fire,
      damageMultiplierProxy.holy,
      damageMultiplierProxy.drill,
      damageMultiplierProxy.slice,
      damageMultiplierProxy.melee,
      damageMultiplierProxy.explosion,
      damageMultiplierProxy.projectile,
      damageMultiplierProxy.electricity,
      damageMultiplierProxy.radioactive,
    ];

    for (const multiplier of extractDamageMultipliers) {
      if (multiplier === undefined) continue;

      const multiplierValue = damageMultipliersTag
        .getAttribute(multiplier)
        ?.asFloat();

      enemy.damageMultipliers[multiplier] =
        multiplierValue ?? enemy.damageMultipliers[multiplier];
    }
  }
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

  const ragdollMaterial = damageModelComponent
    .getAttribute('ragdoll_material')
    ?.asText();

  const fireProbabilityOfIgnition = damageModelComponent
    .getAttribute('fire_probability_of_ignition')
    ?.asFloat();

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

  const airNeeded = damageModelComponent
    .getAttribute('air_needed')
    ?.asBoolean();

  const physicsObjectsDamage = damageModelComponent
    .getAttribute('physics_objects_damage')
    ?.asBoolean();

  return {
    hp,
    maxHp,
    bloodMaterial,
    damages,
    knockBackResistance,
    airNeeded,
    ragdollMaterial,
    fireProbabilityOfIgnition,
    physicsObjectsDamage,
  };
};

const calculateGold = (hp: number) => {
  // based on data\scripts\items\drop_money.lua

  let originalHp = hp / NoitaConstants.hpMultiplier;
  if (originalHp > 1) {
    originalHp = mathHelpers.floor(originalHp);
  }

  const calculatedGold = originalHp * NoitaConstants.hpGoldMultiplier;
  const actualGold = Math.max(calculatedGold, NoitaConstants.minGoldDrop);

  return mathHelpers.round(actualGold);
};

const splitTags = (tags: string) => {
  return tags.split(',');
};
