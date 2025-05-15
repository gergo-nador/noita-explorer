import { create } from 'zustand';
import { noitaAPI } from '../ipcHandlers';
import { StringKeyDictionary } from '@noita-explorer/model';
import {
  EnemyStatistic,
  NoitaSession,
  NoitaWandBonesFile,
  NoitaWorldState,
} from '@noita-explorer/model-noita';
import { noiToast } from '@noita-explorer/noita-component-library';
import { Dispatch, SetStateAction } from 'react';

interface Save00CurrentRun {
  worldState: NoitaWorldState;
}

type Save00Status = 'unset' | 'loading' | 'loaded' | 'failed';

interface Save00StoreState {
  enemyStatistics: StringKeyDictionary<EnemyStatistic> | undefined;
  unlockedSpells: string[] | undefined;
  unlockedPerks: string[] | undefined;
  sessions: NoitaSession[] | undefined;
  bonesWands: NoitaWandBonesFile[] | undefined;
  currentRun: Save00CurrentRun | undefined;

  status: Save00Status;
  reload: () => Promise<void>;
  modify: Dispatch<SetStateAction<Save00StoreState>>;
}

export const useSave00Store = create<Save00StoreState>((set, get) => ({
  enemyStatistics: undefined,
  unlockedPerks: undefined,
  unlockedSpells: undefined,
  sessions: undefined,
  bonesWands: undefined,
  currentRun: undefined,

  status: 'unset',
  reload: async () => {
    set({
      ...get(),
      status: 'loading',
    });

    try {
      const enemyStatistics =
        await noitaAPI.noita.save00.scrapeEnemyStatistics();
      const flags = await noitaAPI.noita.save00.scrapeProgressFlags();
      const sessions = await noitaAPI.noita.save00.scrapeSessions();
      const bonesWands = await noitaAPI.noita.save00.scrapeBonesWands();

      const worldState = await noitaAPI.noita.save00.scrapeWorldState();

      set({
        enemyStatistics: enemyStatistics,
        unlockedPerks: flags.perks.length > 0 ? flags.perks : undefined,
        unlockedSpells: flags.spells.length > 0 ? flags.spells : undefined,
        sessions: sessions,
        bonesWands: bonesWands,

        currentRun:
          worldState !== undefined ? { worldState: worldState } : undefined,

        status: 'loaded',
      });
    } catch (ex) {
      set({ ...get(), status: 'failed' });

      console.error(ex);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const message = ex?.message ?? 'unknown reason';
      noiToast.error('Failed to load game data from save00 folder: ' + message);
    }
  },
  modify: (action) => set(action),
}));
