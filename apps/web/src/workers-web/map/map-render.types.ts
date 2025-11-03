import { ChunkBorders, NoitaBackgroundTheme } from '@noita-explorer/map';
import { StreamInfoBackground } from '@noita-explorer/model-noita';
import { Buffer } from 'buffer';
import { Vector2d } from '@noita-explorer/model';

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
    },
    // has to be top level argument for transferable
    canvas: OffscreenCanvas,
    petriFileBuffer: Buffer,
  ) => Promise<void>;
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
