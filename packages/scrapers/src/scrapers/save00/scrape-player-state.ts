import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { noitaPaths } from '../../noita-paths.ts';
import {
  parseXml,
  XmlWrapper,
  XmlWrapperType,
} from '@noita-explorer/tools/xml';
import {
  NoitaPlayerState,
  NoitaEntityTransform,
  NoitaDamageModel,
  getDefaultNoitaDamageMultipliers,
  NoitaInventoryWand,
} from '@noita-explorer/model-noita';
import { extractDamageMultipliers } from '../datawak/scrape-enemies/extract-damage-multipliers.ts';
import { extractGenomeData } from '../datawak/scrape-enemies/extract-genome-data.ts';
import { splitNoitaEntityTags } from '../common/tags.ts';
import { scrapeWand } from '../common/scrape-wand.ts';

export const scrapePlayerState = async ({
  save00DirectoryApi,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
}): Promise<NoitaPlayerState | undefined> => {
  const playerStateFilePath = await save00DirectoryApi.path.join(
    noitaPaths.save00.player,
  );

  let playerStateFile: FileSystemFileAccess;
  try {
    playerStateFile = await save00DirectoryApi.getFile(playerStateFilePath);
  } catch {
    return undefined;
  }

  const playerStateText = await playerStateFile.read.asText();
  const playerStateXml = await parseXml(playerStateText);
  const xmlWrapper = XmlWrapper(playerStateXml);

  const playerStateEntity = xmlWrapper.findNthTag('Entity');
  if (playerStateEntity === undefined) {
    throw new Error('Could not find root Entity tag');
  }

  const transformComponent = playerStateEntity.findNthTag('_Transform');
  if (transformComponent === undefined) {
    throw new Error('Could not find _Transform tag');
  }

  const transform: NoitaEntityTransform = {
    position: {
      x: transformComponent.getRequiredAttribute('position.x').asFloat(),
      y: transformComponent.getRequiredAttribute('position.y').asFloat(),
    },
    rotation: transformComponent.getRequiredAttribute('rotation').asInt(),
    scale: {
      x: transformComponent.getRequiredAttribute('scale.x').asFloat(),
      y: transformComponent.getRequiredAttribute('scale.y').asFloat(),
    },
  };

  const damageModelComponent = playerStateEntity.findNthTag(
    'DamageModelComponent',
  );
  if (damageModelComponent === undefined) {
    throw new Error('Could not find DamageModelComponent tag');
  }

  const damageModel: NoitaDamageModel = {
    airInLungs: damageModelComponent.getAttribute('air_in_lungs')?.asFloat(),
    airInLungsMax: damageModelComponent
      .getAttribute('air_in_lungs_max')
      ?.asFloat(),
    airLackOfDamage: damageModelComponent
      .getAttribute('air_lack_of_damage')
      ?.asFloat(),

    bloodMaterial:
      damageModelComponent.getRequiredAttribute('blood_material').asText() ??
      'no_material',

    hp: damageModelComponent.getRequiredAttribute('hp').asFloat(),
    maxHp: damageModelComponent.getRequiredAttribute('max_hp').asFloat(),
    damageMultipliers: getDefaultNoitaDamageMultipliers(),
  };

  const damageMultipliersComponent =
    damageModelComponent.findNthTag('damage_multipliers');

  if (damageMultipliersComponent) {
    extractDamageMultipliers({
      damageMultipliers: damageModel.damageMultipliers,
      damageMultipliersTag: damageMultipliersComponent,
    });
  }

  const genomeDataComponent = playerStateEntity.findNthTag(
    'GenomeDataComponent',
  );
  const genomeData = genomeDataComponent
    ? extractGenomeData({
        genomeData: undefined,
        genomeDataComponent: genomeDataComponent,
      })
    : undefined;

  const inventoryWands: NoitaInventoryWand[] = [];
  const playerEntities = playerStateEntity.findTagArray('Entity');

  const quickInventoryComponent = playerEntities.find(
    (e) => e.getAttribute('name')?.asText() === 'inventory_quick',
  );
  if (quickInventoryComponent) {
    const inventoryEntities = quickInventoryComponent.findTagArray('Entity');
    const wandEntities = inventoryEntities.filter((e) => {
      const tagString = e.getAttribute('tags')?.asText() ?? '';
      const tags = splitNoitaEntityTags(tagString);
      return tags.includes('wand');
    });

    wandEntities.forEach((wandEntity) => {
      const wand = scrapeWand({ wandXml: wandEntity });
      if (wand) {
        inventoryWands.push({ wand: wand });
      }
    });
  }

  const playerState: NoitaPlayerState = {
    transform: transform,
    damageModel: damageModel,
    genomeData: genomeData,
    inventory: {
      wands: inventoryWands,
    },
    decorations: {
      player_amulet: getDecoration({
        tag: 'player_amulet',
        entities: playerEntities,
      }),
      player_amulet_gem: getDecoration({
        tag: 'player_amulet_gem',
        entities: playerEntities,
      }),
      player_hat2: getDecoration({
        tag: 'player_hat2',
        entities: playerEntities,
      }),
    },
  };

  return playerState;
};

const getDecoration = ({
  tag,
  entities,
}: {
  tag: string;
  entities: XmlWrapperType[];
}): { enabled: boolean } => {
  const tagXml = entities.find((e) => {
    const tagsAttr = e.getAttribute('_tags')?.asText();
    if (!tagsAttr) return false;

    const tags = splitNoitaEntityTags(tagsAttr);
    return tags.includes(tag);
  });

  if (!tagXml) {
    return { enabled: false };
  }

  const enabled = tagXml.getAttribute('_enabled')?.asBoolean() ?? false;
  return { enabled: enabled };
};
