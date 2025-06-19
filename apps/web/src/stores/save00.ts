import { create } from 'zustand';
import { noitaAPI } from '../noita-api.ts';
import { StringKeyDictionary } from '@noita-explorer/model';
import {
  EnemyStatistic,
  NoitaPlayerState,
  NoitaSession,
  NoitaWandBonesFile,
  NoitaWorldState,
} from '@noita-explorer/model-noita';
import { noiToast } from '@noita-explorer/noita-component-library';
import { Dispatch, SetStateAction } from 'react';
import { sentry } from '../utils/sentry.ts';

interface Save00CurrentRun {
  worldState: NoitaWorldState;
  playerState: NoitaPlayerState;
}

type Save00Status = 'unset' | 'loading' | 'loaded' | 'failed';

interface Save00StoreState {
  enemyStatistics: StringKeyDictionary<EnemyStatistic> | undefined;
  unlockedSpells: string[] | undefined;
  unlockedPerks: string[] | undefined;
  sessions: NoitaSession[] | undefined;
  bonesWands: NoitaWandBonesFile[] | undefined;
  currentRun: Save00CurrentRun | undefined;
  unlockedOrbs: string[] | undefined;
  flags: Set<string> | undefined;

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
  unlockedOrbs: undefined,
  flags: undefined,

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
      const playerState = await noitaAPI.noita.save00.scrapePlayerState();
      const orbsUnlocked = await noitaAPI.noita.save00.scrapeOrbsUnlocked();

      set({
        enemyStatistics: enemyStatistics,
        unlockedPerks: flags.perks.length > 0 ? flags.perks : undefined,
        unlockedSpells: flags.spells.length > 0 ? flags.spells : undefined,
        sessions: sessions,
        bonesWands: bonesWands,
        unlockedOrbs: orbsUnlocked,
        flags: new Set(flags.all),

        currentRun:
          worldState !== undefined && playerState !== undefined
            ? { worldState, playerState }
            : undefined,

        status: 'loaded',
      });
    } catch (ex) {
      set({ ...get(), status: 'failed' });

      console.error(ex);
      sentry.captureError(ex);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const message = ex?.message ?? 'unknown reason';
      noiToast.error('Failed to load game data from save00 folder: ' + message);
    }
  },
  modify: (action) => set(action),
}));
