import { createContext } from 'react';

interface TabViewContextType {
  activeTabId: string | undefined;
}

export const TabViewContext = createContext<TabViewContextType>({
  activeTabId: undefined,
});
