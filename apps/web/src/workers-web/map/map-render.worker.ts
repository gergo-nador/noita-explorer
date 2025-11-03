// @ts-expect-error for some reason threads types are not recognized
import { expose, Transfer } from 'threads/worker';
import {
  renderBiomeTile,
  renderTerrainTile,
  renderBackgroundTile,
  mapConstants,
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
  async renderBiomeTile(props) {
    if (!dataWakDirectory || !setupData) {
      throw new Error('[Worker] data wak not set');
    }

    try {
      const offScreenCanvas = new OffscreenCanvas(
        mapConstants.chunkWidth,
        mapConstants.chunkHeight,
      );
      const ctx = offScreenCanvas.getContext('2d', {
        alpha: true,
        willReadFrequently: true,
      });
      if (!ctx) {
        throw new Error('OffscreenCanvasRenderingContext2D not supported');
      }

      ctx.clearRect(0, 0, mapConstants.chunkWidth, mapConstants.chunkHeight);
      await renderBiomeTile({
        ctx,
        chunkBorders: props.chunkBorders,
        backgroundItems: props.backgrounds,
        biomeCoords: props.biomeCoords,
        biomes: setupData.biomes,
        dataWakDirectory,
      });

      return Transfer(offScreenCanvas.transferToImageBitmap());
    } catch (error) {
      console.error('Error during rendering biome tile', props, error);
      throw error;
    }
  },
  async renderTerrainTile(props) {
    if (!dataWakDirectory || !setupData) {
      throw new Error('[Worker] data wak not set');
    }

    try {
      const offScreenCanvas = new OffscreenCanvas(
        mapConstants.chunkWidth,
        mapConstants.chunkHeight,
      );
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

      let petriBuffer = props.petriFileBuffer;
      // unpack transferable object
      if ('send' in props.petriFileBuffer) {
        const arrayBuffer = props.petriFileBuffer.send as ArrayBuffer;

        petriBuffer = new Uint8Array(arrayBuffer) as Buffer;
      }

      const petriContent = await scrape.save00.pngPetriFile({
        pngPetriFile: petriBuffer,
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

      ctx.putImageData(imageData, 0, 0);

      return Transfer(offScreenCanvas.transferToImageBitmap());
    } catch (error) {
      console.error('Error during rendering terrain tile', props, error);
      throw error;
    }
  },
  async renderBackgroundTile(props) {
    if (!dataWakDirectory) {
      throw new Error('[Worker] data wak not set');
    }

    try {
      const offScreenCanvas = new OffscreenCanvas(props.size.x, props.size.y);

      const ctx = offScreenCanvas.getContext('2d');
      if (!ctx) {
        throw new Error('OffscreenCanvasRenderingContext2D not supported');
      }

      await renderBackgroundTile({
        coords: props.coords,
        theme: props.theme,
        ctx,
        dataWakDirectory,
      });

      return Transfer(offScreenCanvas.transferToImageBitmap());
    } catch (error) {
      console.error('Error during rendering background tile', props, error);
      throw error;
    }
  },
};

expose(mapRenderer);
