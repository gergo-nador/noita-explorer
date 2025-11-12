import L from 'leaflet';
import { NoitaPetriFileCollection } from '../../noita-map.types.ts';
import {
  MapRendererPool,
  MapRendererWorker,
  Transfer,
} from '../../map-renderer-threads/threads-pool.types.ts';
import { setErrorTile } from '../_shared/set-error-tile.ts';
import { WebTransferable } from '@noita-explorer/model';

export const TerrainLayer = L.GridLayer.extend({
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const tile = L.DomUtil.create('div', 'leaflet-tile');

    //const streamInfo: StreamInfoFileFormat = this.options.streamInfo;
    const petriFiles: NoitaPetriFileCollection = this.options.petriFiles;
    const petriFile = petriFiles?.[coords.x]?.[coords.y];

    if (!petriFile) {
      tile.innerHTML = '';
      done(undefined, tile);
      return tile;
    }

    //const entityFiles: NoitaEntityFileCollection = this.options.entityFiles;

    //const entityFileNum = 2000 * coords.y + coords.x;
    //const entityFile = entityFiles[entityFileNum];

    const renderPool: MapRendererPool = this.options.renderPool;

    const canvas = document.createElement('canvas');
    canvas.style.imageRendering = 'pixelated';
    canvas.width = 512;
    canvas.height = 512;

    renderPool
      .queue(async (worker: MapRendererWorker) => {
        let transferable = petriFile.supportsTransferable();
        // fallback: read file as buffer
        if (!transferable) {
          const array: Uint8Array = await petriFile.read.asBuffer();
          transferable = Transfer(array.buffer);
        }

        const offscreenCanvas = canvas.transferControlToOffscreen();

        return worker.renderTerrainTile(
          {
            chunkCoordinates: coords,
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

    /*
    fastLzCompressorService
      .get()
      .then(async (compressor) => ({
        chunk: await processPetriFile({ petriFile, compressor }),
        entities: entityFile
          ? await processEntityFile({
              entityFile,
              chunkCoords: coords,
              fastLzCompressor: compressor,
              schemaHash: streamInfo.entitySchemaHash,
            })
          : undefined,
      }))
      .then(async (processedData) => {
        const renderedChunk = renderChunk({
          chunk: processedData.chunk,
          chunkCoordinates: { x: coords.x, y: coords.y },
          materials: this.options.materials,
          materialImageCache: this.options.materialImageCache,
          materialColorCache: this.options.materialColorCache,
          entities: processedData.entities ?? [],
        });

        if (!renderedChunk) {
          done(undefined, tile);
          tile.appendChild(document.createElement('div'));
          return;
        }

        tile.innerHTML = '';
        tile.appendChild(renderedChunk.canvas);

        done(undefined, tile);
      })
      .catch((error) => {
        // Optional: Handle errors, e.g., show an error tile.
        console.error('Failed to decompress and render chunk:', error);
        tile.innerHTML = '';
        const div = document.createElement('div');
        div.textContent = 'Error';
        tile.appendChild(div);

        done(error, tile);
      });*/

    return tile;
  },
});
