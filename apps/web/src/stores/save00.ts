/*
import { create } from 'zustand';
import { noitaAPI } from '../ipcHandlers';
import { EnemyStatistic, StringKeyDictionary } from '@noita-explorer/model';

interface Save00StoreState {
  enemyStatistics: StringKeyDictionary<EnemyStatistic> | undefined;
  unlockedSpells: string[] | undefined;
  unlockedPerks: string[] | undefined;
  reload: () => Promise<void>;
}

export const useSave00Store = create<Save00StoreState>((set) => ({
  enemyStatistics: undefined,
  unlockedPerks: undefined,
  unlockedSpells: undefined,

  reload: async () => {
    const enemyStatistics = await noitaAPI.noita.save00.getEnemyStatistics();
    const flags = await noitaAPI.noita.save00.readFlags();

    set({
      enemyStatistics: enemyStatistics.enemies,
      unlockedPerks: flags.perks,
      unlockedSpells: flags.spells,
    });
  },
}));
*/
