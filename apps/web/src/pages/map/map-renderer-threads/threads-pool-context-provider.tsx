import React, { useEffect, useState } from 'react';
// @ts-expect-error threads module is not recognized correctly
import { Pool, spawn } from 'threads';
import { MapRenderType } from '../../../workers-web/map/map-render.types.ts';
import MapWorkerUrl from '../../../workers-web/map/map-render.worker.ts?worker';
import { ThreadsPoolContext } from './threads-pool-context.ts';

interface Props {
  children: React.ReactNode;
}

export const ThreadsPoolContextProvider = ({ children }: Props) => {
  const [pool, setPool] = useState<Pool<MapRenderType>>();

  useEffect(() => {
    // Create a pool with multiple workers
    const pool = Pool<MapRenderType>(() => spawn(new MapWorkerUrl()), {
      size: 4,
      concurrency: 1,
    });

    setPool(pool);

    return () => {
      pool.terminate(true);
    };
  }, []);

  if (!pool) {
    return <div>Loading...</div>;
  }

  return (
    <ThreadsPoolContext.Provider value={{ pool }}>
      {children}
    </ThreadsPoolContext.Provider>
  );
};
