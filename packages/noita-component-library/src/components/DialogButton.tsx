import { ShowButtonDialogProps } from '../ui-models/ShowDialogButtonProps.ts';
import { ShowCustomDialogProps } from '../ui-models/ShowDialogCustomProps.ts';
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
          {props.buttons.map((button) => {
            const onClick = () =>
              typeof button.onClick === 'function' && button.onClick();

            return (
              <Button key={button.id} onClick={() => onClick()}>
                {button.title}
              </Button>
            );
          })}
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
