type ImageType = 'default' | 'default-high-q';

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
    map: {
      unexplored: () => '/images/map/unexplored.png',
      tileError: () => '/images/map/tile-render-error-image.png',
    },
    holidays: (file: string) => '/images/holidays/' + file,
  },
  generated: {
    orbs: ({ orbId }: { orbId: string }) => {
      const path = `/g/orbs/${orbId}/gifs/`;
      return { gif: path + 'default.gif', firstFrame: path + 'default-f.png' };
    },
    perk: {
      image: ({ perkId, type }: { perkId: string; type?: ImageType }) => {
        type ??= 'default';
        return `/g/perks/${perkId}/images/${type}.png`;
      },
    },
    spell: {
      image({ spellId, type }: { spellId: string; type?: ImageType }) {
        type ??= 'default';
        return `/g/spells/${spellId}/images/${type}.png`;
      },
    },
    enemy: {
      image: ({
        enemyId,
        type,
      }: {
        enemyId: string;
        type?: ImageType | 'physics';
      }) => {
        type ??= 'default';
        return `/g/enemies/${enemyId}/images/${type}.png`;
      },
      gifs: ({
        enemyId,
        gifName,
        gifReloadCounter,
      }: {
        enemyId: string;
        gifName: string;
        gifReloadCounter?: number;
      }) => {
        const path = `/g/enemies/${enemyId}/gifs/${gifName}`;
        const queryParams =
          gifReloadCounter !== undefined ? '?r=' + gifReloadCounter : '';

        return {
          gif: path + '.gif' + queryParams,
          firstFrame: path + '-f.png',
        };
      },
    },
    material: {
      image({
        materialId,
        type,
      }: {
        materialId: string;
        type?: ImageType | 'potion' | 'pouch';
      }) {
        type ??= 'default';
        return `/g/materials/${materialId}/images/${type}.png`;
      },
    },
    wand: {
      image({ wandId }: { wandId: string }) {
        return `/g/wands/${wandId}/images/default.png`;
      },
    },
  },
};
