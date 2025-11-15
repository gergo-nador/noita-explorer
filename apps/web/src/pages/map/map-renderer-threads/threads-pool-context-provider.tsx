import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
// @ts-expect-error threads module is not recognized correctly
import { Pool, spawn } from 'threads';
import { MapRenderType } from '../../../workers-web/map/map-render.types.ts';
import MapWorkerUrl from '../../../workers-web/map/map-render.worker.ts?worker';
import { ThreadsPoolContext, WorkerStatus } from './threads-pool-context.ts';
import { MapRendererPool } from './threads-pool.types.ts';
import { useSettingsStore } from '../../../stores/settings.ts';

interface Props {
  children: React.ReactNode;
}

export const ThreadsPoolContextProvider = ({ children }: Props) => {
  const { settings } = useSettingsStore();
  const [workerPool, setPool] = useState<MapRendererPool | undefined>();
  const [status, setStatus] = useState<Record<number, WorkerStatus>>({});
  const [isLoaded, setIsLoaded] = useState(false);

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

  async function init(dataWakBuffer: Buffer) {
    if (workerPool !== undefined) {
      return;
    }

    const numberOfWorkersToInitialize =
      settings.map.workerAmountType === 'auto'
        ? navigator.hardwareConcurrency
        : Math.max(settings.map.customWorkerCount, 1);

    const pool: MapRendererPool = Pool<MapRenderType>(
      () => spawn(new MapWorkerUrl()),
      {
        size: numberOfWorkersToInitialize,
        concurrency: 2,
      },
    );
    setPool(pool);

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
  }

  useEffect(() => {
    return () => {
      if (workerPool) {
        void workerPool.terminate(true);
      }
    };
  }, []);

  return (
    <ThreadsPoolContext.Provider
      value={{ pool: workerPool, status, isLoaded, init: (args) => init(args) }}
    >
      {children}
    </ThreadsPoolContext.Provider>
  );
};
