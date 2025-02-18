import React, { createContext } from 'react';

interface TabViewContextType {
  activeTabId: string | undefined;
  setActiveTab: (tab: React.ReactNode) => void;
}

export const TabViewContext = createContext<TabViewContextType>({
  activeTabId: undefined,
  setActiveTab: () => {
    throw new Error('setOpenedWindow not implemented');
  },
});
