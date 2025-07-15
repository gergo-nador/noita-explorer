export const publicPaths = {
  orbs: ({ orbId }: { orbId: string }) => {
    const path = `/g/orb-gifs/${orbId}/`;
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
    const path = `/g/enemy-gifs/${enemyId}/${gifName}`;
    const queryParams =
      gifReloadCounter !== undefined ? '?r=' + gifReloadCounter : '';

    return {
      gif: path + '.gif' + queryParams,
      firstFrame: path + '-f.png',
    };
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
