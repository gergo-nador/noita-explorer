import { publicPaths } from '../../../../utils/public-paths.ts';

export const setErrorTile = (tile: HTMLDivElement) => {
  const img = document.createElement('img');
  img.style.shapeRendering = publicPaths.static.map.tileError();

  tile.appendChild(img);
};
