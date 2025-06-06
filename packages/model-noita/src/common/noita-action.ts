export type NoitaAction =
  | BonesDeleteFileAction
  | UnlockPerkAction
  | UnlockSpellAction
  | UnlockEnemyAction
  | UnlockDecorationAction
  | UnlockFlagAction;

export interface NoitaActionResult {
  type: 'success' | 'error';
  action: NoitaAction;
  error?: Error;
}

export interface NoitaActionProgress {
  all: number;
  failed: number;
  success: number;
}

interface NoitaActionBase {
  id: string;
  name: string;
}

export interface BonesDeleteFileAction extends NoitaActionBase {
  type: 'bones-wand-delete';
  payload: {
    bonesFileName: string;
  };
}

export interface UnlockPerkAction extends NoitaActionBase {
  type: 'unlock-perk';
  payload: {
    perkId: string;
  };
}

export interface UnlockSpellAction extends NoitaActionBase {
  type: 'unlock-spell';
  payload: {
    spellId: string;
  };
}

export interface UnlockEnemyAction extends NoitaActionBase {
  type: 'unlock-enemy';
  payload: { enemyId: string; numberOfTimesEnemyKilled: number };
}

export type PlayerDecorationUnlock =
  | 'secret_amulet'
  | 'secret_amulet_gem'
  | 'secret_hat';

export interface UnlockDecorationAction extends NoitaActionBase {
  type: 'unlock-decoration';
  payload: { decoration: PlayerDecorationUnlock; permanent: boolean };
}

export interface UnlockFlagAction extends NoitaActionBase {
  type: 'unlock-flag';
  payload: { flag: string };
}
