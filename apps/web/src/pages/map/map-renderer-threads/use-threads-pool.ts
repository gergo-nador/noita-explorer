import { useContext } from 'react';
import { ThreadsPoolContext } from './threads-pool-context.ts';

export const useThreadsPool = () => useContext(ThreadsPoolContext);
