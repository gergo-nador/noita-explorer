import L from 'leaflet';
import { FastLZCompressor } from '@noita-explorer/fastlz';
import {
  readRawChunk,
  renderChunk,
  uncompressNoitaFile,
} from '@noita-explorer/map';
import { NoitaPetriFileCollection } from '../noita-map.types.ts';

export const NoitaGridLayer = L.GridLayer.extend({
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const tile = L.DomUtil.create('div', 'leaflet-tile');

    const files: NoitaPetriFileCollection = this.options.petriFiles;
    const currentFile = files?.[coords.x]?.[coords.y];

    if (!currentFile) {
      const div = document.createElement('div');
      div.textContent = 'No tile';

      tile.innerHTML = '';
      tile.appendChild(div);

      done(undefined, tile);
      return tile;
    }

    const fastLzCompressorPromise: Promise<FastLZCompressor> =
      this.options.fastLzCompressorPromise;

    fastLzCompressorPromise
      .then((compressor) => uncompressNoitaFile(currentFile, compressor))
      .then((uncompressed) => readRawChunk(uncompressed))
      .then(async (chunk) => {
        /*
        const entityBuffer = findEntityFileForChunk({
          chunkCoords: { x: output.num1 / 512, y: output.num2 / 512 },
          files: this.options.entityFiles,
        });
        const compressor = await fastLzCompressorPromise;
        const entityFileLoaded =
          entityBuffer &&
          (await loadEntityFile({
            buffer: entityBuffer,
            compressor: compressor,
          }));

        const entities =
          entityFileLoaded &&
          (await prepareEntities({
            entities: entityFileLoaded.entities,
            dataWak: await dataWakPromise,
          }));*/
        //const fileName = `entities_${2000 * output.num1 + output.num2}.bin`;
        //const entities = this.options.entityFiles[fileName];

        const renderedChunk = renderChunk({
          chunk,
          chunkCoordinates: { x: coords.x, y: coords.y },
          materials: this.options.materials,
          materialImageCache: this.options.materialImageCache,
          materialColorCache: this.options.materialColorCache,
          entities: [],
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
      });

    return tile;
  },
});
