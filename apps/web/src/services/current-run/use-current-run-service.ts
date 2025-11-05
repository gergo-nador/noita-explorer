import { useContext } from 'react';
import { CurrentRunServiceContext } from './current-run-service.context.ts';

export const useCurrentRunService = () => {
  return useContext(CurrentRunServiceContext);
};
