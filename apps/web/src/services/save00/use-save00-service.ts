import { useContext } from 'react';
import { Save00ServiceContext } from './save00-service.context.ts';

export const useSave00Service = () => {
  const save00Service = useContext(Save00ServiceContext);
  return save00Service;
};
