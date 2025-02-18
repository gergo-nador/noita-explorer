import { DialogButton } from './dialog-button';
import { useDialogStore } from '../ui-stores/dialog-store';
import { DialogCustom } from './dialog-custom';

export const DialogWrapper = () => {
  const { isOpen, type, props, close } = useDialogStore();

  if (props === undefined) {
    return <div></div>;
  }

  if (type === 'button' && 'buttons' in props) {
    return (
      <DialogButton isOpen={isOpen} onCloseRequest={close} props={props} />
    );
  }
  if (type === 'custom' && 'children' in props) {
    return (
      <DialogCustom isOpen={isOpen} onCloseRequest={close} props={props} />
    );
  }

  return <div></div>;
};
