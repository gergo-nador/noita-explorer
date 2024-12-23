export interface NoitaSession {
  id: string;
  buildName: string;
  seed: number;
  playTime: number;
  startedAt: Date;

  dead: boolean;
  deathPosX: number;
  deathPosY: number;
  damageTaken: number;
  enemiesKilled: number;
  killedByEntity: string | undefined;
  killedByReason: string | undefined;

  gold: number;
  goldAll: number;
  goldInfinite: boolean;
}
