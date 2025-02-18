export interface ContextMenuItemSimple {
  type: 'item';
  title: string;
  disabled?: boolean;
  action: () => void;
}
