import L from 'leaflet';
import {
  Map2dOrganizedObject,
  NoitaPetriFileCollection,
} from '../../noita-map.types.ts';
import {
  MapRendererPool,
  MapRendererWorker,
  Transfer,
} from '../../map-renderer-threads/threads-pool.types.ts';
import { setErrorTile } from '../_shared/set-error-tile.ts';
import { WebTransferable } from '@noita-explorer/model';
import { convertFileToWebTransferable } from '../../utils/convertFileToWebTransferable.ts';
import { ChunkRenderableEntitySprite } from '@noita-explorer/map';

export const TerrainLayer = L.GridLayer.extend({
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const tile = L.DomUtil.create('div', 'leaflet-tile');

    const petriFiles: NoitaPetriFileCollection = this.options.petriFiles;
    const petriFile = petriFiles?.[coords.x]?.[coords.y];

    if (!petriFile) {
      tile.innerHTML = '';
      done(undefined, tile);
      return tile;
    }

    const backgroundEntitiesCollection: Map2dOrganizedObject<
      ChunkRenderableEntitySprite[]
    > = this.options.backgroundEntities;
    const backgroundEntities =
      backgroundEntitiesCollection?.[coords.x]?.[coords.y] ?? [];

    const renderPool: MapRendererPool = this.options.renderPool;

    const canvas = document.createElement('canvas');
    canvas.style.imageRendering = 'pixelated';
    canvas.width = 512;
    canvas.height = 512;

    renderPool
      .queue(async (worker: MapRendererWorker) => {
        const transferable = await convertFileToWebTransferable(petriFile);
        const offscreenCanvas = canvas.transferControlToOffscreen();

        return worker.renderTerrainTile(
          {
            chunkCoordinates: coords,
            backgroundEntities: backgroundEntities,
          },
          Transfer(offscreenCanvas),
          transferable as WebTransferable,
        );
      })
      .then(() => tile.appendChild(canvas))
      .catch((err: unknown) => {
        console.error('error during biome tile render', err);
        setErrorTile(tile);
      })
      .then(() => done(undefined, tile));

    return tile;
  },
});
