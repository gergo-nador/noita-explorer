// @ts-expect-error for some reason threads types are not recognized
import { expose } from 'threads/worker';
import {
  renderBiomeTile,
  renderTerrainTile,
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
    const offScreenCanvas = new OffscreenCanvas(
      mapConstants.chunkWidth,
      mapConstants.chunkHeight,
    );
    const ctx = offScreenCanvas.getContext('2d', { alpha: true });
    if (!ctx) {
      return;
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

    return ctx.getImageData(
      0,
      0,
      offScreenCanvas.width,
      offScreenCanvas.height,
    );
  },
  async renderTerrainTile(props) {
    const offScreenCanvas = new OffscreenCanvas(
      mapConstants.chunkWidth,
      mapConstants.chunkHeight,
    );
    const ctx = offScreenCanvas.getContext('2d');
    if (!ctx) {
      return;
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
      materials: setupData.materials,
      materialColorCache,
      materialImageCache: setupData.materialColorCache,
    });

    return imageData;
  },
};

expose(mapRenderer);
