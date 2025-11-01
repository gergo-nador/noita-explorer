// @ts-expect-error for some reason threads types are not recognized
import { expose, Transfer } from 'threads/worker';
import {
  renderBiomeTile,
  renderTerrainTile,
  renderBackgroundTile,
  mapConstants,
} from '@noita-explorer/map';
import { MapRenderType } from './map-render.types.ts';
import { mapRendererSetup } from './map-renderer.setup.ts';
import { StringKeyDictionary } from '@noita-explorer/model';
import { scrape } from '@noita-explorer/scrapers';

const setupDataPromise = mapRendererSetup();
const materialColorCache: StringKeyDictionary<number> = {};

const mapRenderer: MapRenderType = {
  async renderBiomeTile(props) {
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

      const setupData = await setupDataPromise;

      ctx.clearRect(0, 0, mapConstants.chunkWidth, mapConstants.chunkHeight);
      await renderBiomeTile({
        ctx,
        chunkBorders: props.chunkBorders,
        backgroundItems: props.backgrounds,
        biomeCoords: props.biomeCoords,
        biomes: setupData.biomes,
      });

      return Transfer(offScreenCanvas.transferToImageBitmap());
    } catch (error) {
      console.error('Error during rendering biome tile', props, error);
    }
  },
  async renderTerrainTile(props) {
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
      const setupData = await setupDataPromise;

      const petriContent = await scrape.save00.pngPetriFile({
        pngPetriFile: props.petriFileBuffer,
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
    }
  },
  async renderBackgroundTile(props) {
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
      });

      return Transfer(offScreenCanvas.transferToImageBitmap());
    } catch (error) {
      console.error('Error during rendering background tile', props, error);
    }
  },
};

expose(mapRenderer);
