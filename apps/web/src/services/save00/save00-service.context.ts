import { createContext } from 'react';
import { StringKeyDictionary } from '@noita-explorer/model';
import {
  EnemyStatistic,
  NoitaSession,
  NoitaWandBonesFile,
} from '@noita-explorer/model-noita';

interface Props {
  enemyStatistics: StringKeyDictionary<EnemyStatistic>;
  unlockedSpells: string[] | undefined;
  unlockedPerks: string[] | undefined;
  sessions: NoitaSession[];
  bonesWands: NoitaWandBonesFile[];
  unlockedOrbs: string[];
  flags: Set<string>;
}

export const Save00ServiceContext = createContext<Props>({} as Props);
