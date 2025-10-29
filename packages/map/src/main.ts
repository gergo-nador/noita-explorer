export { renderChunk } from './chunks/render-chunk.ts';

export type { PixelCalculator } from './interfaces/pixel-calculator.ts';
export type {
  ChunkRenderableEntity,
  ChunkRenderableEntitySprite,
} from './chunks/chunk-renderable-entity.ts';

// new exports
export type { ChunkBorders } from './interfaces/chunk-borders.ts';
export { mapConstants, CAVE_LIMIT_Y } from './map-constants.ts';
export { renderBiomeTile } from './render/biomes/render-biome-tile.ts';
export { renderTerrainTile } from './render/terrain/render-terrain-tile.ts';
