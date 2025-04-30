import { create } from 'zustand';
import { noiToast } from '@noita-explorer/noita-component-library';

export type NoitaActionType = 'bones-wand-delete';
type NoitaActionStatus = 'created' | 'on-list';

interface NoitaAction {
  type: NoitaActionType;
  id: string;
  name: string;
  status: NoitaActionStatus;

  addToList: () => void;
}

interface ActionsState {
  actionUtils: {
    deleteBonesWand: {
      isOnList: (fileName: string) => boolean;
      create: (fileName: string) => NoitaAction;
    };
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
      create: (fileName) => {
        const newAction: NoitaAction = {
          type: 'bones-wand-delete',
          id: 'bones-' + fileName,
          name: 'Delete Bones file: ' + fileName,
          status: 'created',

          addToList: () => {
            set((prev) => {
              if (newAction.id in prev.actions) {
                noiToast.warning(
                  `The deletion of the bones file "${fileName}" is already on the list.`,
                );
                return prev;
              }

              newAction.status = 'on-list';
              noiToast.info(`File deletion "${fileName}" added to the list`);
              const actions = { ...prev.actions };
              actions[newAction.id] = newAction;

              return { ...prev, actions };
            });
          },
        };

        return newAction;
      },
    },
  },
}));
