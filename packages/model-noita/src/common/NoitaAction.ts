export type NoitaAction = BonesDeleteFileAction;

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
