import { NoitaProgressEntity } from './NoitaProgressEntity';

export interface NoitaPerk extends NoitaProgressEntity {
  description: string;

  // perk specific
  stackable: boolean;
  stackableIsRare: boolean;
  stackableMaximum: number | undefined;
  stackableHowOftenReappears: number | undefined;
  maxInPerkPool: number | undefined;
  usableByEnemies: boolean;
  oneOffEffect: boolean;
  doNotRemove: boolean;
  notInDefaultPerkPool: boolean;
  gameEffects: string[];
}
