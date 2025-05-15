import { create } from 'zustand';
import {
  BonesDeleteFileAction,
  NoitaAction,
  NoitaPerk,
  UnlockPerkAction,
} from '@noita-explorer/model-noita';

interface ActionsState {
  actionUtils: {
    deleteBonesWand: {
      isOnList: (fileName: string) => boolean;
      get: (fileName: string) => BonesDeleteFileAction | undefined;
      create: (fileName: string) => BonesDeleteFileAction;
    };
    perksUnlock: {
      isOnList: (perkId: string) => boolean;
      get: (perkId: string) => UnlockPerkAction | undefined;
      create: (perk: NoitaPerk) => UnlockPerkAction;
    };
    removeAction: (action: NoitaAction) => void;
  };

  actions: Record<string, NoitaAction>;
}

export const useNoitaActionsStore = create<ActionsState>((set, get) => {
  const isOnList = (actionId: string) => actionId in get().actions;

  const idFactory = {
    deleteBonesWand: (fileName: string) => 'bones-' + fileName,
    perksUnlock: (perkId: string) => 'perk-unlock-' + perkId,
  };

  const addAction = (action: NoitaAction) => {
    set((prev) => {
      if (action.id in prev.actions) {
        return prev;
      }

      const actions = { ...prev.actions };
      actions[action.id] = action;

      return { ...prev, actions };
    });
  };

  const getAction = (actionId: string): NoitaAction | undefined =>
    get().actions[actionId];

  return {
    actions: {},
    actionUtils: {
      deleteBonesWand: {
        isOnList: (fileName) => {
          const id = idFactory.deleteBonesWand(fileName);
          return isOnList(id);
        },
        get: (fileName) => {
          const id = idFactory.deleteBonesWand(fileName);
          const action = getAction(id);

          if (action?.type !== 'bones-wand-delete') {
            return;
          }

          return action;
        },
        create: (fileName) => {
          const newAction: BonesDeleteFileAction = {
            type: 'bones-wand-delete',
            id: idFactory.deleteBonesWand(fileName),
            name: 'Delete Bones file: ' + fileName,
            payload: {
              bonesFileName: fileName,
            },
          };

          addAction(newAction);

          return newAction;
        },
      },
      perksUnlock: {
        isOnList: (perkId) => {
          const id = idFactory.perksUnlock(perkId);
          return isOnList(id);
        },
        get: (perkId) => {
          const id = idFactory.perksUnlock(perkId);
          const action = getAction(id);

          if (action?.type !== 'unlock-perk') {
            return;
          }

          return action;
        },
        create: (perk) => {
          const newAction: UnlockPerkAction = {
            type: 'unlock-perk',
            id: idFactory.perksUnlock(perk.id),
            name: 'Unlock perk ' + perk.name,
            payload: { perkId: perk.id },
          };

          addAction(newAction);

          return newAction;
        },
      },
      removeAction: (action) => {
        set((prev) => {
          const newActions = { ...prev.actions };
          delete newActions[action.id];

          return { ...prev, actions: newActions };
        });
      },
    },
  };
});
