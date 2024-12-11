import { useState } from 'react';

export const useBool = (defaultValue = false) => {
  const [state, setState] = useState(defaultValue);

  return {
    flip: () => setState((prev) => !prev),
    setTrue: () => setState(true),
    setFalse: () => setState(false),
    state: state,
  };
};
