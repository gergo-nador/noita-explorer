import { createContext } from 'react';
import { NoitaWakData } from '@noita-explorer/model-noita';
import { NoitaLookupData } from '../../stores/noita-data-wak.ts';

interface Props {
  data: NoitaWakData;
  lookup: NoitaLookupData;
}

export const DataWakServiceContext = createContext<Props>({} as Props);
