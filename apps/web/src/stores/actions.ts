import { create } from 'zustand';
import {
  BonesDeleteFileAction,
  NoitaAction,
} from '@noita-explorer/model-noita';

interface ActionsState {
  actionUtils: {
    deleteBonesWand: {
      isOnList: (fileName: string) => boolean;
      create: (fileName: string) => BonesDeleteFileAction;
      get: (fileName: string) => BonesDeleteFileAction | undefined;
    };
    removeAction: (action: NoitaAction) => void;
  };

  actions: Record<string, NoitaAction>;
}

export const useNoitaActionsStore = create<ActionsState>((set, get) => ({
  actions: {},
  actionUtils: {
    deleteBonesWand: {
      isOnList: (fileName) => {
        const id = 'bones-' + fileName;
        return id in get().actions;
      },
      get: (fileName) => {
        const id = 'bones-' + fileName;
        const action = get().actions[id];

        if (action.type !== 'bones-wand-delete') {
          return;
        }

        return action;
      },
      create: (fileName) => {
        const newAction: BonesDeleteFileAction = {
          type: 'bones-wand-delete',
          id: 'bones-' + fileName,
          name: 'Delete Bones file: ' + fileName,
          payload: {
            bonesFileName: fileName,
          },
        };

        set((prev) => {
          if (newAction.id in prev.actions) {
            return prev;
          }

          const actions = { ...prev.actions };
          actions[newAction.id] = newAction;

          return { ...prev, actions };
        });

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
}));
