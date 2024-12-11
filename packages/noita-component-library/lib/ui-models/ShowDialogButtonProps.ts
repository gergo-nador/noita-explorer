export interface ShowButtonDialogProps {
  title: string;
  buttons: DialogButton[];
}

interface DialogButton {
  id: string;
  title: string;
  onClick?: () => void;
}
