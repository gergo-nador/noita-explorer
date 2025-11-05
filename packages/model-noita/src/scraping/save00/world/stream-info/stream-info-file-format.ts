import { StreamInfoBackground } from './stream-info-background.ts';
import { StreamInfoChunkInfo } from './stream-info-chunk-info.ts';

export interface StreamInfoFileFormat {
  seed: number;
  framesPlayed: number;
  secondsPlayed: number;

  backgrounds: StreamInfoBackground[];

  chunkCount: number;
  entitySchemaHash: string;

  gameModeIndex: number;
  gameModeName: string;

  nonNollaModUsed: boolean;

  saveAndQuitDate: Date;
  newGamePlusName: string;

  chunkInfo: StreamInfoChunkInfo[];
}
