export interface ContextMenuItemSimple {
  type: 'item';
  title: string;
  action: () => void;
}
