import { createContext } from 'react';
import { MapRendererPool } from './threads-pool.types.ts';

interface Props {
  pool: MapRendererPool;
}
export const ThreadsPoolContext = createContext<Props | undefined>(undefined);
