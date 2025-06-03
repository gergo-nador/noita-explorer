import { NoitaPerk } from '@noita-explorer/model-noita';

export interface AchievementPerk {
  id: string;
  count: number | undefined;
  perk: NoitaPerk;
}
