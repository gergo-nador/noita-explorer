export type NoitaAction = BonesDeleteFileAction | UnlockPerkAction;

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
