import {
  ChunkBorders,
  ChunkRenderableEntity,
  ChunkRenderableEntitySprite,
  NoitaBackgroundTheme,
} from '@noita-explorer/map';
import {
  NoitaEntitySchema,
  StreamInfoBackground,
} from '@noita-explorer/model-noita';
import { Vector2d, WebTransferable } from '@noita-explorer/model';

export interface MapRenderType {
  renderBiomeTile: (
    props: {
      chunkBorders: ChunkBorders;
      backgrounds: StreamInfoBackground[];
      biomeCoords: Vector2d;
    },
    // has to be top level argument for transferable
    canvas: OffscreenCanvas,
  ) => Promise<void>;
  renderTerrainTile: (
    props: {
      chunkCoordinates: Vector2d;
      backgroundEntities: ChunkRenderableEntitySprite[];
    },
    // has to be top level argument for transferable
    canvas: OffscreenCanvas,
    petriFileBuffer: WebTransferable,
  ) => Promise<void>;
  renderBackgroundTile: (
    props: {
      coords: Vector2d;
      theme: NoitaBackgroundTheme;
    },
    // has to be top level argument for transferable
    canvas: OffscreenCanvas,
  ) => Promise<void>;
  parseEntityFile: (
    props: { schema: NoitaEntitySchema },
    entityFileBuffer: WebTransferable,
  ) => Promise<{ entities: ChunkRenderableEntity[] }>;
}
