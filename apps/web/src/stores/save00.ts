import { create } from 'zustand';
import { noitaAPI } from '../ipcHandlers';
import { EnemyStatistic, StringKeyDictionary } from '@noita-explorer/model';

interface Save00StoreState {
  enemyStatistics: StringKeyDictionary<EnemyStatistic> | undefined;
  unlockedSpells: string[] | undefined;
  unlockedPerks: string[] | undefined;
  loaded: boolean;
  reload: () => Promise<void>;
}

export const useSave00Store = create<Save00StoreState>((set) => ({
  enemyStatistics: undefined,
  unlockedPerks: undefined,
  unlockedSpells: undefined,
  loaded: false,

  reload: async () => {
    const enemyStatistics = await noitaAPI.noita.save00.scrapeEnemyStatistics();
    const flags = await noitaAPI.noita.save00.scrapeProgressFlags();

    set({
      enemyStatistics: enemyStatistics,
      unlockedPerks: flags.perks.length > 0 ? flags.perks : undefined,
      unlockedSpells: flags.spells.length > 0 ? flags.spells : undefined,
    });
  },
}));
