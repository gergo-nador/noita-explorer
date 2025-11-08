import { Vector2d } from '@noita-explorer/model';
import L from 'leaflet';
import { publicPaths } from '../../../../utils/public-paths.ts';
import { mapConstants } from '@noita-explorer/map';
import { ChunkInfoCollection } from '../../noita-map.types.ts';

interface Props {
  coords: Vector2d;
  chunkInfos: ChunkInfoCollection;
}

export const createUnexploredTile = ({ coords, chunkInfos }: Props) => {
  if (coords.y < 0) {
    return L.DomUtil.create('div', 'leaflet-tile');
  }

  let hasTileLoadedAroundIt = false;

  for (let x = coords.x - 1; x <= coords.x + 1; x++) {
    for (let y = coords.y - 1; y <= coords.y + 1; y++) {
      const chunk = chunkInfos[x]?.[y];
      if (!chunk) continue;

      if (chunk.loaded) {
        hasTileLoadedAroundIt = true;
        break;
      }
    }

    if (hasTileLoadedAroundIt) break;
  }

  if (hasTileLoadedAroundIt) {
    const imgTile = L.DomUtil.create('img', 'leaflet-tile');
    imgTile.src = publicPaths.static.map.unexplored();
    imgTile.width = mapConstants.chunkWidth;
    imgTile.height = mapConstants.chunkHeight;
    imgTile.style.filter = 'brightness(0.65)';

    return imgTile;
  }

  const blackTile = L.DomUtil.create('div', 'leaflet-tile');
  blackTile.style.backgroundColor = 'black';

  return blackTile;
};
