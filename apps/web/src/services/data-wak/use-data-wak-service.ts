import { useContext } from 'react';
import { DataWakServiceContext } from './data-wak-service.context.ts';

export const useDataWakService = () => {
  const dataWakService = useContext(DataWakServiceContext);
  return dataWakService;
};
