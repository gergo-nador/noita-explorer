// src/components/WorkerDemo.tsx
import { useState } from 'react';
import { spawn, Thread } from 'threads';

// Import the worker file using Vite's special `?worker` syntax
import HeavyTaskWorker from './workers/threads/map/map-render.worker.ts?worker';

// Import the worker's type for type-safe communication
import type { HeavyTaskWorker as HeavyTaskWorkerType } from './workers/threads/map/map-render.worker.ts';

export function WorkerDemo() {
  const [sumResult, setSumResult] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const runHeavyTask = async () => {
    setIsLoading(true);
    // 1. Spawn the worker
    const worker = await spawn<HeavyTaskWorkerType>(new HeavyTaskWorker());

    // 2. Call the exposed worker functions
    const sum = await worker.sum(1_000_000_000);
    const msg = await worker.getMessage();

    // 3. Update state with the results
    setSumResult(sum);
    setMessage(msg);

    // 4. Terminate the worker to free up resources
    await Thread.terminate(worker);
    setIsLoading(false);
  };

  return (
    <div>
      <h2>Offload Heavy Tasks with threads.js 🚀</h2>
      <button onClick={runHeavyTask} disabled={isLoading}>
        {isLoading ? 'Calculating...' : 'Run Heavy Task'}
      </button>

      {sumResult !== null && <p>Sum Result: {sumResult.toLocaleString()}</p>}
      {message && <p>Worker Message: "{message}"</p>}
    </div>
  );
}
