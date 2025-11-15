import {
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
      backgrounds: StreamInfoBackground[];
      tileCoords: Vector2d;
    },
    canvas: OffscreenCanvas,
  ) => Promise<void>;
  renderTerrainTile: (
    props: {
      tileCoords: Vector2d;
      backgroundEntities: ChunkRenderableEntitySprite[];
    },
    canvas: OffscreenCanvas,
    petriFileBuffer: WebTransferable,
  ) => Promise<void>;
  renderBackgroundTile: (
    props: {
      coords: Vector2d;
      theme: NoitaBackgroundTheme;
    },
    canvas: OffscreenCanvas,
  ) => Promise<void>;
  parseEntityFile: (
    props: { schema: NoitaEntitySchema },
    entityFileBuffer: WebTransferable,
  ) => Promise<{ entities: ChunkRenderableEntity[] }>;
  renderEntityTile: (
    props: {
      tileCoords: Vector2d;
      entities: ChunkRenderableEntitySprite[];
    },
    canvas: OffscreenCanvas,
  ) => Promise<void>;
}
