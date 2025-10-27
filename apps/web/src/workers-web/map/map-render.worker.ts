// @ts-expect-error for some reason threads types are not recognized
import { expose } from 'threads/worker';
import { renderBiomeTile, mapConstants } from '@noita-explorer/map';
import { MapRenderType } from './map-render.types.ts';

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
      backgroundItems: [],
      biome: props.biome,
    });

    return ctx.getImageData(
      0,
      0,
      offScreenCanvas.width,
      offScreenCanvas.height,
    );
  },
};

expose(mapRenderer);
