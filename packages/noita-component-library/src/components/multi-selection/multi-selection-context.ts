import { createContext, Dispatch, SetStateAction } from 'react';
import { functionHelpers } from '@noita-explorer/tools';

interface MultiSelectionContextType<T> {
  currentValue: T | undefined;
  setValue: Dispatch<SetStateAction<T>>;
  unselectOnClick: boolean;
}

export const MultiSelectionContext = createContext<
  MultiSelectionContextType<unknown>
>({
  currentValue: undefined,
  setValue: functionHelpers.emptyFunction,
  unselectOnClick: false,
});
