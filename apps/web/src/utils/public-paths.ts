import { NoitaEnemyImageMedia } from '@noita-explorer/model-noita';

export const publicPaths = {
  static: {
    backgrounds: (file: string) => '/images/backgrounds/' + file,
    dataWak: {
      damages: (fileName: string) => `/images/data-wak/damages/${fileName}.png`,
      spellBackgrounds: (fileName: string) =>
        `/images/data-wak/spell-backgrounds/${fileName}.png`,
      spellProperties: (fileName: string) =>
        `/images/data-wak/spell-properties/${fileName}.png`,
      protections: (fileName: string) =>
        `/images/data-wak/protections/${fileName}.png`,
      icons: (fileName: string) => `/images/data-wak/icons/${fileName}.png`,
      misc: (fileName: string) => `/images/data-wak/misc/${fileName}.png`,
    },
  },
  generated: {
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
  },
};
