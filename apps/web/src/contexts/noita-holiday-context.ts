import { createContext, Dispatch } from 'react';

export interface NoitaHolidayContextType {
  fireFireworks: Dispatch<number>;
}

const emptyFunction = () => {};
export const NoitaHolidayContext = createContext<NoitaHolidayContextType>({
  fireFireworks: emptyFunction,
});
