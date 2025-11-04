import { Vector2d } from '@noita-explorer/model';
import L from 'leaflet';
import { publicPaths } from '../../../../utils/public-paths.ts';
import { mapConstants } from '@noita-explorer/map';
import { StreamInfoFileFormat } from '@noita-explorer/model-noita';

interface Props {
  coords: Vector2d;
  streamInfo: StreamInfoFileFormat;
}

export const createUnexploredTile = ({ coords, streamInfo }: Props) => {
  if (coords.y < 0) {
    return L.DomUtil.create('div', 'leaflet-tile');
  }

  const hasTileLoadedAroundIt = streamInfo.chunkInfo.some((chunk) => {
    if (!chunk.loaded) return false;

    if (chunk.position.x < coords.x - 1 || chunk.position.x > coords.x + 1)
      return false;

    return chunk.position.y <= coords.y + 1 && chunk.position.y >= coords.y - 1;
  });
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
