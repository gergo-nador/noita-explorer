import { ChunkBorders, NoitaBackgroundTheme } from '@noita-explorer/map';
import { StreamInfoBackground } from '@noita-explorer/model-noita';
import { Buffer } from 'buffer';
import { Vector2d } from '@noita-explorer/model';

export interface MapRenderType {
  renderBiomeTile: (props: {
    chunkBorders: ChunkBorders;
    backgrounds: StreamInfoBackground[];
    biomeCoords: Vector2d;
  }) => Promise<ImageBitmap | undefined>;
  renderTerrainTile: (props: {
    petriFileBuffer: Buffer;
    chunkCoordinates: Vector2d;
  }) => Promise<ImageBitmap | undefined>;
  renderBackgroundTile: (
    props: {
      coords: Vector2d;
      theme: NoitaBackgroundTheme;
      size: Vector2d;
    },
    // has to be top level argument for transferable
    canvas: OffscreenCanvas,
  ) => Promise<void>;
}
