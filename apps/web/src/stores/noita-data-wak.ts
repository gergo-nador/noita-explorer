import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import {
  NoitaEnemy,
  NoitaMaterial,
  NoitaPerk,
  NoitaSpell,
  NoitaWakData,
} from '@noita-explorer/model-noita';
import { arrayHelpers } from '@noita-explorer/tools';

interface NoitaLookupData {
  enemies: Record<string, NoitaEnemy>;
  perks: Record<string, NoitaPerk>;
  spells: Record<string, NoitaSpell>;
  materials: Record<string, NoitaMaterial>;
}

interface NoitaDataWakState {
  loaded: boolean;
  exists: boolean | undefined;
  data: NoitaWakData | undefined;
  lookup: NoitaLookupData | undefined;

  setExists: (exists: boolean) => void;
  load: (args: NoitaWakData) => void;
}

export const noitaDataWakStore = createStore<NoitaDataWakState>((set) => ({
  loaded: false,
  exists: undefined,
  data: undefined,
  lookup: undefined,
  setExists: (exists) => {
    set({
      loaded: false,
      exists: exists,
      data: undefined,
    });
  },
  load: (args) => {
    const lookup: NoitaLookupData = {
      perks: arrayHelpers.asDict(args.perks, 'id'),
      enemies: arrayHelpers.asDict(args.enemies, 'id'),
      spells: arrayHelpers.asDict(args.spells, 'id'),
      materials: arrayHelpers.asDict(args.materials, 'id'),
    };

    set({
      loaded: true,
      exists: true,
      data: args,
      lookup: lookup,
    });
  },
}));

export const useNoitaDataWakStore = (): NoitaDataWakState => {
  const value = useStore(noitaDataWakStore);

  // for some reason useStore doesn't work with SSG
  return __SSG__ ? noitaDataWakStore.getState() : value;
};
