export type NoitaAction =
  | BonesDeleteFileAction
  | UnlockPerkAction
  | UnlockSpellAction;

export interface NoitaActionResult {
  type: 'success' | 'error';
  action: NoitaAction;
  error?: Error;
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
