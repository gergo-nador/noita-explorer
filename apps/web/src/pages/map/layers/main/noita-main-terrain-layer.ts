import L from 'leaflet';
import { NoitaPetriFileCollection } from '../../noita-map.types.ts';
import {
  MapRendererPool,
  MapRendererWorker,
} from '../../map-renderer-threads/threads-pool.types.ts';
// @ts-expect-error for some reason threads types are not recognized
import { Transfer } from 'threads';
import { publicPaths } from '../../../../utils/public-paths.ts';
import { mapConstants } from '@noita-explorer/map';

export const NoitaMainTerrainLayer = L.GridLayer.extend({
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const tile = L.DomUtil.create('div', 'leaflet-tile');

    //const streamInfo: StreamInfoFileFormat = this.options.streamInfo;
    const petriFiles: NoitaPetriFileCollection = this.options.petriFiles;
    const petriFile = petriFiles?.[coords.x]?.[coords.y];

    if (!petriFile) {
      const div = document.createElement('div');
      div.textContent = 'No tile';

      tile.innerHTML = '';
      tile.appendChild(div);

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

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('CanvasRenderingContext2D not available');
      const imageElement = document.createElement('img');
      imageElement.src = publicPaths.static.map.tileError();
      imageElement.width = mapConstants.chunkWidth;
      imageElement.height = mapConstants.chunkHeight;

      tile.appendChild(imageElement);
      // `done` needs to be called after returning
      setTimeout(() => done(undefined, tile), 0);

      return tile;
    }

    renderPool
      .queue(async (worker: MapRendererWorker) => {
        const array: Uint8Array = await petriFile.read.asBuffer();

        return worker.renderTerrainTile({
          petriFileBuffer: Transfer(array.buffer),
          chunkCoordinates: coords,
        });
      })
      .then((image: ImageBitmap | undefined) => {
        if (image) {
          ctx.drawImage(image, 0, 0);
          tile.appendChild(canvas);
        }
      })
      .catch((err: unknown) => {
        console.error('error during biome tile render', err);
        const imageElement = document.createElement('img');
        imageElement.src = publicPaths.static.map.tileError();
        imageElement.width = mapConstants.chunkWidth;
        imageElement.height = mapConstants.chunkHeight;

        tile.appendChild(imageElement);
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
