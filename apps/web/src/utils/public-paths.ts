import { NoitaEnemyImageMedia } from '@noita-explorer/model-noita';

export const publicPaths = {
  orbs: ({ orbId }: { orbId: string }) => {
    const path = `/g/orb-gifs/${orbId}/gifs/`;
    return { gif: path + 'default.gif', firstFrame: path + 'default-f.png' };
  },
  enemyGifs: ({
    enemyId,
    gifName,
    gifReloadCounter,
  }: {
    enemyId: string;
    gifName: string;
    gifReloadCounter?: number;
  }) => {
    const path = `/g/enemy-media/${enemyId}/gifs/${gifName}`;
    const queryParams =
      gifReloadCounter !== undefined ? '?r=' + gifReloadCounter : '';

    return {
      gif: path + '.gif' + queryParams,
      firstFrame: path + '-f.png',
    };
  },
  enemyImage: ({
    enemyId,
    type,
  }: {
    enemyId: string;
    type: NoitaEnemyImageMedia['imageType'];
  }) => {
    return `/g/enemy-media/${enemyId}/images/${type}.png`;
  },
  wiki: {
    perks: (perkId: string) => getCurrentBaseUrl() + `/g/wiki/perks/${perkId}`,
    spells: (spellId: string) =>
      getCurrentBaseUrl() + `/g/wiki/spells/${spellId}`,
    enemies: (enemyId: string) =>
      getCurrentBaseUrl() + `/g/wiki/enemies/${enemyId}`,
  },
};

const getCurrentBaseUrl = () =>
  `${window.location.protocol}//${window.location.host}`;
