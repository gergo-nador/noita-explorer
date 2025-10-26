import L from 'leaflet';
import { renderChunk } from '@noita-explorer/map';
import {
  NoitaEntityFileCollection,
  NoitaPetriFileCollection,
} from '../../noita-map.types.ts';
import { processPetriFile } from '../../utils/process-petri-file.ts';
import { processEntityFile } from '../../utils/process-entity-file.ts';
import { fastLzCompressorService } from '../../../../utils/fast-lz-compressor-service.ts';
import { StreamInfoFileFormat } from '@noita-explorer/model-noita';

export const NoitaMainTerrainLayer = L.GridLayer.extend({
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const tile = L.DomUtil.create('div', 'leaflet-tile');

    const streamInfo: StreamInfoFileFormat = this.options.streamInfo;
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

    const entityFiles: NoitaEntityFileCollection = this.options.entityFiles;

    const entityFileNum = 2000 * coords.y + coords.x;
    const entityFile = entityFiles[entityFileNum];

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
