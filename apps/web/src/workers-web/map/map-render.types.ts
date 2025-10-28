import { ChunkBorders } from '@noita-explorer/map';
import { NoitaBiome, StreamInfoBackground } from '@noita-explorer/model-noita';
import { Buffer } from 'buffer';

export interface MapRenderType {
  renderBiomeTile: (props: {
    chunkBorders: ChunkBorders;
    backgrounds: StreamInfoBackground[];
    biome: NoitaBiome;
  }) => Promise<ImageData | undefined>;
  renderTerrainTile: (props: {
    petriFileBuffer: Buffer;
  }) => Promise<ImageData | undefined>;
}
