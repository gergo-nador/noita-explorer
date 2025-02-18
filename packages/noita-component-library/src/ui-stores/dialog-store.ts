import { create } from 'zustand';
import { ShowButtonDialogProps } from '../ui-models/show-dialog-button-props.ts';
import { ShowCustomDialogProps } from '../ui-models/show-dialog-custom-props.ts';

interface DialogState {
  isOpen: boolean;
  type: 'button' | 'custom' | undefined;
  __onCloseCallback: undefined | (() => void);
  props: ShowButtonDialogProps | ShowCustomDialogProps | undefined;

  showCustom: (args: ShowCustomDialogProps) => void;
  showButtonDialog: (
    args: ShowButtonDialogProps,
  ) => Promise<string | undefined>;
  close: () => void;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  isOpen: false,
  type: undefined,
  __onCloseCallback: undefined,
  props: undefined,

  showCustom: (args) => {
    set({
      type: 'custom',
      props: args,
      isOpen: true,
      __onCloseCallback: () => undefined,
    });
  },

  showButtonDialog: (args) => {
    return new Promise((resolve, reject) => {
      for (const button of args.buttons) {
        const onClick = button.onClick;

        button.onClick = () => {
          try {
            if (typeof onClick === 'function') {
              onClick();
            }
          } catch (e) {
            reject(e);
          }

          get().close();
          resolve(button.id);
        };
      }

      set({
        type: 'button',
        props: args,
        isOpen: true,
        __onCloseCallback: () => resolve(undefined),
      });
    });
  },

  close: () => {
    const state = get();
    if (typeof state.__onCloseCallback === 'function') {
      state.__onCloseCallback();
    }

    set({
      type: undefined,
      props: undefined,
      isOpen: false,
      __onCloseCallback: undefined,
    });
  },
}));
