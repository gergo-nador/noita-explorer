import { create } from 'zustand';
import { noitaAPI } from '../ipcHandlers';
import { StringKeyDictionary } from '@noita-explorer/model';
import {
  EnemyStatistic,
  NoitaSession,
  NoitaWand,
  NoitaWorldState,
} from '@noita-explorer/model-noita';

interface Save00CurrentRun {
  worldState: NoitaWorldState;
}

interface Save00StoreState {
  enemyStatistics: StringKeyDictionary<EnemyStatistic> | undefined;
  unlockedSpells: string[] | undefined;
  unlockedPerks: string[] | undefined;
  sessions: NoitaSession[] | undefined;
  bonesWands: NoitaWand[] | undefined;
  currentRun: Save00CurrentRun | undefined;

  loaded: boolean;
  reload: () => Promise<void>;
}

export const useSave00Store = create<Save00StoreState>((set) => ({
  enemyStatistics: undefined,
  unlockedPerks: undefined,
  unlockedSpells: undefined,
  sessions: undefined,
  bonesWands: undefined,
  currentRun: undefined,

  loaded: false,
  reload: async () => {
    const enemyStatistics = await noitaAPI.noita.save00.scrapeEnemyStatistics();
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

      loaded: true,
    });
  },
}));
