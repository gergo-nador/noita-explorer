import {
  ShowButtonDialogProps,
  ShowCustomDialogProps,
} from '../../stores/dialog';
import { Button } from './Button';
import { DialogCustom } from './DialogCustom';

interface DialogButtonProps {
  isOpen: boolean;
  onCloseRequest?: () => void;
  props: ShowButtonDialogProps;
}

export const DialogButton = ({
  isOpen,
  onCloseRequest,
  props,
}: DialogButtonProps) => {
  const customDialogProps: ShowCustomDialogProps = {
    children: (
      <>
        <div>{props.title}</div>
        <br />
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20,
            justifyContent: 'space-evenly',
          }}
        >
          {props.buttons.map((button) => (
            <Button key={button.id} onClick={() => button.onClick()}>
              {button.title}
            </Button>
          ))}
        </div>
      </>
    ),
  };

  return (
    <DialogCustom
      isOpen={isOpen}
      onCloseRequest={onCloseRequest}
      props={customDialogProps}
    />
  );
};
