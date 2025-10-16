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
  NoitaInventoryPotionItem,
  NoitaInventoryItem,
} from '@noita-explorer/model-noita';
import { extractDamageMultipliers } from '../datawak/scrape-enemies/extract-damage-multipliers.ts';
import { extractGenomeData } from '../datawak/scrape-enemies/extract-genome-data.ts';
import { hasEntityTag, splitNoitaEntityTags } from '../common/tags.ts';
import { scrapeWand } from '../common/scrape-wand.ts';
import { scrapePotion } from '../common/scrape-potion.ts';

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

  const playerEntities = playerStateEntity.findTagArray('Entity');

  const playerState: NoitaPlayerState = {
    transform: transform,
    damageModel: damageModel,
    genomeData: genomeData,
    inventory: {
      wands: [],
      items: [],
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
    wallet: undefined,
  };

  const quickInventoryComponent = playerEntities.find(
    (e) => e.getAttribute('name')?.asText() === 'inventory_quick',
  );
  if (quickInventoryComponent) {
    const inventoryEntities = quickInventoryComponent.findTagArray('Entity');

    // quick inventory wands
    {
      const wandEntities = inventoryEntities.filter((e) =>
        hasEntityTag(e, 'wand'),
      );
      playerState.inventory.wands = wandEntities
        .map((wandEntity) => {
          const wand = scrapeWand({ wandXml: wandEntity });

          const itemComponent = wandEntity.findNthTag('ItemComponent');
          const position = itemComponent
            ?.getRequiredAttribute('inventory_slot.x')
            ?.asInt();

          return { wand, position };
        })
        .filter((inventoryWand): inventoryWand is NoitaInventoryWand =>
          Boolean(inventoryWand.wand),
        );
    }

    // quick inventory other items
    {
      const noWandEntities = inventoryEntities.filter(
        (e) => !hasEntityTag(e, 'wand'),
      );

      playerState.inventory.items = noWandEntities
        .map((itemEntity) => {
          const itemComponent = itemEntity.findNthTag('ItemComponent');
          const position = itemComponent
            ?.getRequiredAttribute('inventory_slot.x')
            ?.asInt();

          if (hasEntityTag(itemEntity, 'potion')) {
            const potion = scrapePotion({ xml: itemEntity });
            if (!potion) return;

            const inventoryPotion: NoitaInventoryPotionItem = {
              type: 'potion',
              item: potion,
              position: position ?? 0,
            };
            return inventoryPotion;
          }
        })
        .filter((item): item is NoitaInventoryItem => Boolean(item));
    }
  }

  const characterDataComponent = playerStateEntity.findNthTag(
    'CharacterDataComponent',
  );
  if (characterDataComponent) {
    const rechargeSpeed = characterDataComponent
      .getRequiredAttribute('fly_recharge_spd')
      .asFloat();
    const rechargeSpeedGround = characterDataComponent
      .getRequiredAttribute('fly_recharge_spd_ground')
      .asFloat();
    const flyTimeMax = characterDataComponent
      .getRequiredAttribute('fly_time_max')
      .asFloat();
    const flyingTimeLeft = characterDataComponent
      .getRequiredAttribute('mFlyingTimeLeft')
      .asFloat();

    playerState.fly = {
      rechargeSpeed,
      rechargeSpeedGround,
      flyTimeMax,
      flyingTimeLeft,
    };
  }

  const walletComponent = playerStateEntity.findNthTag('WalletComponent');
  if (walletComponent) {
    // <WalletComponent _enabled="1" mHasReachedInf="0" mMoneyPrevFrame="32603" money="32603" money_spent="16755"></WalletComponent>

    const hasReachedInfinite =
      walletComponent.getAttribute('mHasReachedInf')?.asBoolean() ?? false;

    const money = walletComponent.getRequiredAttribute('money').asInt();

    const moneySpent = walletComponent
      .getRequiredAttribute('money_spent')
      .asInt();

    playerState.wallet = {
      hasReachedInfinite,
      money,
      moneySpent,
    };
  }

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
