// @ts-expect-error for some reason threads types are not recognized
import { expose } from 'threads/worker';
import {
  renderBiomeTile,
  renderTerrainTile,
  renderBackgroundTile,
  parseEntityFile,
  renderEntities,
} from '@noita-explorer/map';
import { MapRenderType } from './map-render.types.ts';
import {
  mapRendererSetup,
  MapRendererSetupData,
} from './map-renderer.setup.ts';
import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { scrape } from '@noita-explorer/scrapers';
import { Buffer } from 'buffer';
import { FileSystemDirectoryAccessDataWakMemory } from '@noita-explorer/file-systems/data-wak-memory-fs';
import { convertWebTransferableToBuffer } from './map-render.utils.ts';

let dataWakDirectory: FileSystemDirectoryAccess | undefined = undefined;
let setupData: MapRendererSetupData | undefined = undefined;
const materialColorCache: StringKeyDictionary<number> = {};

self.onmessage = (event: MessageEvent) => {
  if (event.data.type !== 'WORKER_INIT') {
    return;
  }

  const dataWakBufferArray = event.data.dataWakBuffer;
  const dataWakBuffer = Buffer.from(dataWakBufferArray);
  dataWakDirectory = FileSystemDirectoryAccessDataWakMemory(dataWakBuffer);

  mapRendererSetup({ dataWakDirectory }).then((setup) => {
    setupData = setup;
    self.postMessage({ type: 'WORKER_INIT_DONE' });
  });
};

const mapRenderer: MapRenderType = {
  async renderBiomeTile(props, offScreenCanvas) {
    if (!dataWakDirectory || !setupData) {
      throw new Error('[Worker] data wak not set');
    }

    try {
      const ctx = offScreenCanvas.getContext('2d', {
        alpha: true,
        willReadFrequently: true,
      });
      if (!ctx) {
        throw new Error('OffscreenCanvasRenderingContext2D not supported');
      }

      await renderBiomeTile({
        ctx,
        chunkBorders: props.chunkBorders,
        backgroundItems: props.backgrounds,
        biomeCoords: props.biomeCoords,
        biomes: setupData.biomes,
        dataWakDirectory,
      });
    } catch (error) {
      console.error('Error during rendering biome tile', props, error);
      throw error;
    }
  },
  async renderTerrainTile(props, offScreenCanvas, petriBuffer) {
    if (!dataWakDirectory || !setupData) {
      throw new Error('[Worker] data wak not set');
    }

    try {
      const ctx = offScreenCanvas.getContext('2d');
      if (!ctx) {
        throw new Error('OffscreenCanvasRenderingContext2D not supported');
      }

      const imageData = ctx.getImageData(
        0,
        0,
        offScreenCanvas.width,
        offScreenCanvas.height,
      );

      const buffer = await convertWebTransferableToBuffer(petriBuffer);

      const petriContent = await scrape.save00.pngPetriFile({
        pngPetriFile: buffer,
        fastLzCompressor: setupData.fastLzCompressor,
      });

      renderTerrainTile({
        imageData,
        chunk: petriContent,
        chunkCoordinates: props.chunkCoordinates,
        materials: setupData.materials,
        materialColorCache,
        materialImageCache: setupData.materialColorCache,
      });

      renderEntities({
        imageData,
        chunkCoordinates: props.chunkCoordinates,
        entities: props.backgroundEntities,
      });

      ctx.putImageData(imageData, 0, 0);
    } catch (error) {
      console.error('Error during rendering terrain tile', props, error);
      throw error;
    }
  },
  async renderBackgroundTile(props, offScreenCanvas) {
    if (!dataWakDirectory) {
      throw new Error('[Worker] data wak not set');
    }

    try {
      const ctx = offScreenCanvas.getContext('2d');
      if (!ctx) {
        throw new Error('OffscreenCanvasRenderingContext2D not supported');
      }

      ctx.imageSmoothingEnabled = false;

      await renderBackgroundTile({
        coords: props.coords,
        theme: props.theme,
        ctx,
        dataWakDirectory,
      });
    } catch (error) {
      console.error('Error during rendering background tile', props, error);
      throw error;
    }
  },
  async parseEntityFile(props, entityFileBuffer) {
    if (!dataWakDirectory || !setupData) {
      throw new Error('[Worker] setup not done');
    }

    const buffer = await convertWebTransferableToBuffer(entityFileBuffer);

    const entities = await parseEntityFile({
      fastLzCompressor: setupData.fastLzCompressor,
      entityBuffer: buffer,
      schema: props.schema,
      mediaDimensions: setupData.mediaDimensions,
    });

    return entities;
  },
};

expose(mapRenderer);
