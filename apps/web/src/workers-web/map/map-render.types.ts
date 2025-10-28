import { ChunkBorders } from '@noita-explorer/map';
import {
  ChunkFileFormat,
  NoitaBiome,
  StreamInfoBackground,
} from '@noita-explorer/model-noita';

export interface MapRenderType {
  renderBiomeTile: (props: {
    chunkBorders: ChunkBorders;
    backgrounds: StreamInfoBackground[];
    biome: NoitaBiome;
  }) => Promise<ImageData | undefined>;
  renderTerrainTile: (props: {
    chunk: ChunkFileFormat;
  }) => Promise<ImageData | undefined>;
}
