import { createContext } from 'react';
import { MapRendererPool } from './threads-pool.types.ts';
import { Buffer } from 'buffer';

export interface WorkerStatus {
  id: number;
  state: 'started' | 'initialized' | 'running' | 'init-error' | 'error';
}

interface Props {
  pool: MapRendererPool | undefined;
  status: Record<number, WorkerStatus>;
  isLoaded: boolean;
  init: (dataWakBuffer: Buffer) => void;
}
export const ThreadsPoolContext = createContext<Props>({} as Props);
