import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import {
  NoitaTranslation,
  getDefaultNoitaDamageMultipliers,
  NoitaScrapedEnemy,
  NoitaScrapedEnemyVariant,
  NoitaScrapedSprite,
  NoitaScrapedPhysicsImageShapeComponent,
} from '@noita-explorer/model-noita';
import {
  parseXml,
  XmlWrapper,
  XmlWrapperType,
} from '@noita-explorer/tools/xml';
import {
  fileSystemAccessHelpers,
  stringHelpers,
  objectHelpers,
} from '@noita-explorer/tools';
import { noitaPaths } from '../../../noita-paths.ts';
import { extractEnemyProperties } from './extract-enemy-properties.ts';
import { calculateEnemyGold } from './calculate-enemy-gold.ts';
import { mergeXmlBaseFiles } from './merge-xml-base-files.ts';
import { splitNoitaEntityTags } from '../../common/tags.ts';

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
}): Promise<NoitaScrapedEnemy[]> => {
  // Part 1: Getting a list of animal ids and their corresponding images
  const animalsDirPath = await dataWakParentDirectoryApi.path.join(
    noitaPaths.noitaDataWak.icons.animals,
  );
  const animalsDirectory =
    await dataWakParentDirectoryApi.getDirectory(animalsDirPath);

  const files = await animalsDirectory.listFiles();

  const animalsProcessQueue: {
    animalId: string;
    imageBase64: string;
    imagePath: string;
  }[] = [];
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
      imagePath: file
        .getFullPath()
        .substring(dataWakParentDirectoryApi.getFullPath().length),
    });
  }

  const entitiesDataDirPath = await dataWakParentDirectoryApi.path.join(
    noitaPaths.noitaDataWak.xmlData.entities,
  );
  const entitiesDataDirectory =
    await dataWakParentDirectoryApi.getDirectory(entitiesDataDirPath);

  const animalsDataDirPath = await dataWakParentDirectoryApi.path.join(
    noitaPaths.noitaDataWak.xmlData.animals,
  );
  const animalsDataDirectory =
    await dataWakParentDirectoryApi.getDirectory(animalsDataDirPath);

  const noitaEnemies: NoitaScrapedEnemy[] = [];

  for (const animal of animalsProcessQueue) {
    try {
      const defaultName = translations['animal_' + animal.animalId]?.en;

      const enemy: NoitaScrapedEnemy = {
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
        damageMultipliers: getDefaultNoitaDamageMultipliers(),
        variants: [],
        gameEffects: [],
        tags: [],
        sprites: undefined,
        physicsImageShapes: undefined,
        debug: {
          fileHierarchy: [],
          imagePath: animal.imagePath,
        },
      };

      await scrapeEnemyMain({
        enemy: enemy,
        translations: translations,
        animalsDataDirectory: animalsDataDirectory,
        entitiesDataDirectory: entitiesDataDirectory,
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
  translations,
  dataWakParentDirectoryApi,
  animalsDataDirectory,
  entitiesDataDirectory,
}: {
  enemy: NoitaScrapedEnemy;
  translations: StringKeyDictionary<NoitaTranslation>;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
  animalsDataDirectory: FileSystemDirectoryAccess;
  entitiesDataDirectory: FileSystemDirectoryAccess;
}) => {
  // Find, read and parse the enemy file
  const xmlFileName = enemy.id + '.xml';

  // first look for the xml file in the animals directory
  // (the animals folder should have priority over the others)
  let file = await fileSystemAccessHelpers.findFileInDirectory(
    xmlFileName,
    animalsDataDirectory,
  );

  // then if it was not found, look for it in the entire entities folder
  if (file === undefined) {
    file = await fileSystemAccessHelpers.findFileInDirectory(
      xmlFileName,
      entitiesDataDirectory,
    );
  }

  if (file === undefined) {
    return undefined;
  }

  const enemyXml = await mergeXmlBaseFiles({
    file: file,
    dataWakParentDirectoryApi: dataWakParentDirectoryApi,
  });

  const xml = enemyXml.xml;
  enemy.debug.fileHierarchy = enemyXml.filePathsTraversed;

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

  // then extract the more specific properties for the enemy
  extractEnemyProperties({ enemy, entityTag });

  // dropped gold
  if (enemy.hasGoldDrop) {
    const enemyHpForGold = enemy.maxHp ?? enemy.hp;
    if (enemyHpForGold !== undefined) {
      enemy.goldDrop = calculateEnemyGold(enemyHpForGold);
    }
  }

  // sprites
  enemy.sprites = getSprites({ entityTag });
  enemy.physicsImageShapes = getPhysicsImageShapeComponents({ entityTag });

  // look for variants
  const subDirectories = await entitiesDataDirectory.listDirectories();
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
      await entitiesDataDirectory.path.split(variantFullPath);

    const variantXmlText = await variantFile.read.asText();
    const variantXmlObj = await parseXml(variantXmlText);
    const variantXmlWrapper = XmlWrapper(variantXmlObj);

    const variantEntityTag = variantXmlWrapper.findNthTag('Entity');
    if (variantEntityTag === undefined) {
      continue;
    }

    // ensure the base tag points to the main entity xml file
    const variantBaseTag = variantEntityTag.findNthTag('Base');
    const baseFilePath = variantBaseTag?.getAttribute('file')?.asText();
    if (baseFilePath === undefined) {
      continue;
    }

    const baseFile = await dataWakParentDirectoryApi.getFile(baseFilePath);
    if (baseFile.getFullPath() !== file.getFullPath()) {
      continue;
    }

    const variant: NoitaScrapedEnemyVariant = {
      // the variant id is the folder right before the file name
      variantId: variantFullPathSplit[variantFullPathSplit.length - 2],
      enemy: createVariantEnemy(enemy),
    };

    extractEnemyProperties({
      enemy: variant.enemy as NoitaScrapedEnemy,
      entityTag: variantEntityTag,
    });

    enemy.variants.push(variant);
  }

  return enemy;
};

const createVariantEnemy = (
  enemy: NoitaScrapedEnemy,
): NoitaScrapedEnemyVariant['enemy'] => {
  const enemyCopy = { ...enemy };
  // @ts-expect-error remove the variants property of the enemy to not copy that over
  delete enemyCopy['variants'];
  return objectHelpers.deepCopy(enemyCopy);
};

const getSprites = ({
  entityTag,
}: {
  entityTag: XmlWrapperType;
}): NoitaScrapedSprite[] | undefined => {
  let sprites = entityTag.getChild('SpriteComponent');

  if (sprites === undefined) {
    return;
  }

  sprites = sprites
    // filter out ui, health_bar and laser_sight sprites
    .filter((sprite) => {
      const tags = sprite.getAttribute('_tags')?.asText();
      if (tags === undefined) return true;

      const split = splitNoitaEntityTags(tags);

      const notAllowedTags = ['ui', 'health_bar_back', 'health_bar', 'l'];
      return !notAllowedTags.some((tag) => split.includes(tag));
    })
    // filter out invisible sprites
    .filter((sprite) => {
      const isVisible = sprite.getAttribute('visible')?.asBoolean();
      return isVisible !== false;
    })
    // filter out sprites without image file
    .filter((sprite) => {
      const imageFile = sprite.getAttribute('image_file')?.asText();
      return Boolean(imageFile);
    })
    .filter((sprite) => {
      const fogOfWarHole = sprite.getAttribute('fog_of_war_hole')?.asBoolean();
      return !fogOfWarHole;
    });

  return sprites.map((sprite): NoitaScrapedSprite => {
    return {
      imageFile: sprite.getRequiredAttribute('image_file').asText(),
      alpha: sprite.getAttribute('alpha')?.asFloat(),
      additive: sprite.getAttribute('additive')?.asBoolean(),
      emissive: sprite.getAttribute('emissive')?.asBoolean(),
      offsetX: sprite.getAttribute('offset_x')?.asInt(),
      offsetY: sprite.getAttribute('offset_y')?.asInt(),
    };
  });
};

const getPhysicsImageShapeComponents = ({
  entityTag,
}: {
  entityTag: XmlWrapperType;
}): NoitaScrapedPhysicsImageShapeComponent[] | undefined => {
  const physicsImageShapes = entityTag.getChild('PhysicsImageShapeComponent');

  if (physicsImageShapes === undefined) {
    return;
  }

  return physicsImageShapes.map(
    (s): NoitaScrapedPhysicsImageShapeComponent => ({
      imageFile: s.getRequiredAttribute('image_file').asText(),
      offsetX: s.getAttribute('offset_x')?.asInt(),
      offsetY: s.getAttribute('offset_y')?.asInt(),
      material: s.getAttribute('material')?.asText(),
    }),
  );
};
