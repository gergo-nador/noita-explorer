// src/workers/heavy-task.worker.ts
import { expose } from 'threads/worker';

// Define the functions to be exposed to the main thread
const heavyTask = {
  /**
   * A simple but slow function to simulate a heavy calculation.
   */
  sum(n: number): number {
    let result = 0;
    for (let i = 0; i < n; i++) {
      result += i;
    }
    return result;
  },

  /**
   * An example of an async function in a worker.
   */
  async getMessage(): Promise<string> {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return 'Hello from the worker thread! 👋';
  },
};

// Export the type of the worker for type safety on the main thread
export type HeavyTaskWorker = typeof heavyTask;

// Expose the functions
expose(heavyTask);
