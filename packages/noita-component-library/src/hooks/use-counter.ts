import { useState } from 'react';

export const useCounter = () => {
  const [counter, setCounter] = useState(0);

  return {
    counter,
    increase: (by?: number) => setCounter((prev) => prev + (by ?? 1)),
  };
};
