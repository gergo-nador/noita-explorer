import { create } from 'zustand';
import { MouseEvent } from 'react';
import { ContextMenuItemSeparator } from '../ui-models/ContextMenuItemSeparator.ts';
import { ContextMenuItemSimple } from '../ui-models/ContextMenuItemSimple.ts';

interface ContextMenuState {
  menuItems: ContextMenuItem[];
  event: MouseEvent | undefined;
  contextMenuEventHandler: (
    menuItems: ContextMenuItem[],
  ) => (e: MouseEvent) => void;
}

export type ContextMenuItem = ContextMenuItemSimple | ContextMenuItemSeparator;

export const useContextMenuStore = create<ContextMenuState>((set) => ({
  event: undefined,
  menuItems: [],
  contextMenuEventHandler: (menuItems: ContextMenuItem[]) => (e) => {
    set({
      menuItems: menuItems,
      event: e,
    });
  },
}));
