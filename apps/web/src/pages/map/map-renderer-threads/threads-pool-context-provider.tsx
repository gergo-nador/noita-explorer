import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
// @ts-expect-error threads module is not recognized correctly
import { Pool, spawn } from 'threads';
import { MapRenderType } from '../../../workers-web/map/map-render.types.ts';
import MapWorkerUrl from '../../../workers-web/map/map-render.worker.ts?worker';
import { ThreadsPoolContext, WorkerStatus } from './threads-pool-context.ts';
import { MapRendererPool } from './threads-pool.types.ts';

interface Props {
  children: React.ReactNode;
  dataWakBuffer: Buffer;
}

export const ThreadsPoolContextProvider = ({
  children,
  dataWakBuffer,
}: Props) => {
  const [pool, setPool] = useState<MapRendererPool>();
  const [status, setStatus] = useState<Record<number, WorkerStatus>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Create a pool with multiple workers
    const pool: MapRendererPool = Pool<MapRenderType>(
      () => spawn(new MapWorkerUrl()),
      {
        size: 4,
        concurrency: 2,
      },
    );

    function setWorkerStatus(workerId: number, status: Partial<WorkerStatus>) {
      setStatus((prevState) => {
        const newState = { ...prevState };

        newState[workerId] = {
          ...prevState[workerId],
          ...status,
          id: workerId,
        };

        return newState;
      });
    }

    let numberOfWorkersLoaded = 0;

    // initialize the workers
    const workerCount: number = pool.workers.length;
    for (let i = 0; i < workerCount; i++) {
      const mapRenderWorker: { init: Promise<Record<symbol, Worker>> } =
        pool.workers[i];
      const workerId = i + 1;

      setWorkerStatus(workerId, { state: 'started' });

      mapRenderWorker.init
        .catch(() => setWorkerStatus(workerId, { state: 'init-error' }))
        .then((workerWrapper) => {
          if (!workerWrapper) {
            return;
          }

          const symbols = Object.getOwnPropertySymbols(workerWrapper);
          const workerSymbol = symbols.find(
            (sym) => sym.toString() === 'Symbol(thread.worker)',
          );

          if (workerSymbol === undefined) {
            throw new Error('thread.worker symbol was not found');
          }

          const worker = workerWrapper[workerSymbol];

          worker.postMessage({
            type: 'WORKER_INIT',
            dataWakBuffer: dataWakBuffer.buffer,
          });

          worker.addEventListener('message', (message) => {
            if (message.data.type === 'WORKER_INIT_DONE') {
              setWorkerStatus(workerId, { state: 'running' });
              numberOfWorkersLoaded++;
              if (numberOfWorkersLoaded === workerCount) {
                setIsLoaded(true);
              }
              return;
            }
          });

          worker.addEventListener('error', (message) => {
            console.error(`error in worker #${workerId}`, message);
            setWorkerStatus(workerId, { state: 'error' });
          });
        })
        .catch(() => setWorkerStatus(workerId, { state: 'error' }));
    }

    setPool(pool);

    return () => {
      pool.terminate(true);
    };
  }, []);

  return (
    <ThreadsPoolContext.Provider value={{ pool, status, isLoaded }}>
      {children}
    </ThreadsPoolContext.Provider>
  );
};
