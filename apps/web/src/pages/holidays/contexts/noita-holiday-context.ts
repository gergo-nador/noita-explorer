import { createContext, Dispatch } from 'react';
import { functionHelpers } from '@noita-explorer/tools';

export interface NoitaHolidayContextType {
  fireFireworks: Dispatch<number>;
}

export const NoitaHolidayContext = createContext<NoitaHolidayContextType>({
  fireFireworks: functionHelpers.emptyFunction,
});
