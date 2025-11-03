import { mapConstants } from '@noita-explorer/map';

export const backgroundLayerSize = {
  width: mapConstants.chunkWidth * 12,
  height: mapConstants.chunkHeight * 6,
} as const;
