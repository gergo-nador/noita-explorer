import { publicPaths } from '../../../../utils/public-paths.ts';

export const setErrorTile = (tile: HTMLDivElement) => {
  tile.style.backgroundImage = publicPaths.static.map.tileError();
  tile.style.backgroundRepeat = 'repeat';
};
