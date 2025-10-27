import { ChunkBorders } from '@noita-explorer/map';
import { NoitaBiome, StreamInfoBackground } from '@noita-explorer/model-noita';

export interface MapRenderType {
  renderBiomeTile: (props: {
    chunkBorders: ChunkBorders;
    backgrounds: StreamInfoBackground[];
    biome: NoitaBiome;
  }) => Promise<ImageData | undefined>;
}
