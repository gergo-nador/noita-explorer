import { ChunkRenderableEntity } from '@noita-explorer/map';

export type EntityStorageType = Record<
  number, // x
  Record<
    number, // y
    {
      state: 'loading' | 'loaded';
      entities: ChunkRenderableEntity[];
    }
  >
>;
