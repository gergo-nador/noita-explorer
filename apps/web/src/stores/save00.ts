import { create } from 'zustand';
import { noitaAPI } from '../ipcHandlers';
import {
  EnemyStatistic,
  NoitaSession,
  StringKeyDictionary,
} from '@noita-explorer/model';

interface Save00StoreState {
  enemyStatistics: StringKeyDictionary<EnemyStatistic> | undefined;
  unlockedSpells: string[] | undefined;
  unlockedPerks: string[] | undefined;
  sessions: NoitaSession[] | undefined;
  loaded: boolean;
  reload: () => Promise<void>;
}

export const useSave00Store = create<Save00StoreState>((set) => ({
  enemyStatistics: undefined,
  unlockedPerks: undefined,
  unlockedSpells: undefined,
  sessions: undefined,
  loaded: false,

  reload: async () => {
    const enemyStatistics = await noitaAPI.noita.save00.scrapeEnemyStatistics();
    const flags = await noitaAPI.noita.save00.scrapeProgressFlags();
    const sessions = await noitaAPI.noita.save00.scrapeSessions();

    set({
      enemyStatistics: enemyStatistics,
      unlockedPerks: flags.perks.length > 0 ? flags.perks : undefined,
      unlockedSpells: flags.spells.length > 0 ? flags.spells : undefined,
      sessions: sessions,
      loaded: true,
    });
  },
}));
