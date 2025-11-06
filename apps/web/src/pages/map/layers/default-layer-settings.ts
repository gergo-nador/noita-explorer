export const defaultLayerZoomSettings = {
  minZoom: -5,
  maxZoom: 5,
  minNativeZoom: 0,
  maxNativeZoom: 0,
} as const;

export const defaultLayerBufferSettings = {
  keepBuffer: 3,
  edgeBufferTiles: 1,
} as const;

export const defaultLayerMiscSettings = {
  noWrap: true,
} as const;

export const defaultLayerSize = { tileSize: 512 } as const;
