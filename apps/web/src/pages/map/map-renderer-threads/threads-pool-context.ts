import { createContext } from 'react';
import { MapRendererPool } from './threads-pool.types.ts';

export interface WorkerStatus {
  id: number;
  state: 'started' | 'initialized' | 'running' | 'init-error' | 'error';
}

interface Props {
  pool: MapRendererPool;
  status: Record<number, WorkerStatus>;
  isLoaded: boolean;
}
export const ThreadsPoolContext = createContext<Props | undefined>(undefined);
