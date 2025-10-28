// @ts-expect-error for some reason threads types are not recognized
import { expose } from 'threads/worker';
import {
  renderBiomeTile,
  renderTerrainTile,
  mapConstants,
} from '@noita-explorer/map';
import { MapRenderType } from './map-render.types.ts';
import { mapRendererSetup } from './map-renderer.setup.ts';
import { RgbaColor, StringKeyDictionary } from '@noita-explorer/model';

const setupDataPromise = mapRendererSetup();
const materialColorCache: StringKeyDictionary<RgbaColor> = {};

const mapRenderer: MapRenderType = {
  async renderBiomeTile(props) {
    const offScreenCanvas = new OffscreenCanvas(
      mapConstants.chunkWidth,
      mapConstants.chunkHeight,
    );
    const ctx = offScreenCanvas.getContext('2d');
    if (!ctx) {
      return;
    }

    await renderBiomeTile({
      ctx,
      chunkBorders: props.chunkBorders,
      backgroundItems: props.backgrounds,
      biome: props.biome,
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

    renderTerrainTile({
      imageData,
      chunk: props.chunk,
      materials: setupData.materials,
      materialColorCache,
      materialImageCache: setupData.materialColorCache,
    });

    return imageData;
  },
};

expose(mapRenderer);
