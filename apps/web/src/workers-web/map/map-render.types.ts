import { ChunkBorders } from '@noita-explorer/map';
import { NoitaBiome } from '@noita-explorer/model-noita';

export interface MapRenderType {
  renderBiomeTile: (props: {
    chunkBorders: ChunkBorders;
    biome: NoitaBiome;
  }) => Promise<ImageData | undefined>;
}
