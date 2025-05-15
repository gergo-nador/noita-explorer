export type NoitaAction = BonesDeleteFileAction;

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
