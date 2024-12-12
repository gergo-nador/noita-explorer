import { create } from 'zustand';
import { NoitaWakData } from '@noita-explorer/model';

interface NoitaDataWakState {
  loaded: boolean;
  exists: boolean | undefined;
  data: NoitaWakData | undefined;

  setExists: (exists: boolean) => void;
  load: (args: NoitaWakData) => void;
}

export const useNoitaDataWakStore = create<NoitaDataWakState>((set) => ({
  loaded: false,
  exists: undefined,
  data: undefined,
  setExists: (exists) => {
    set({
      loaded: false,
      exists: exists,
      data: undefined,
    });
  },
  load: (args) => {
    set({
      loaded: true,
      exists: true,
      data: args,
    });
  },
}));
