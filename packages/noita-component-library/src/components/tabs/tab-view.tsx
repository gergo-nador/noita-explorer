import { Card } from '../card/card';
import React, { useCallback, useState } from 'react';
import { TabItem } from './tab-item';
import { zIndexManager } from '../../zIndexManager.ts';
import { TabViewContext } from './tab-view-context';

interface TabViewProps {
  style?: React.CSSProperties;
  styleCard?: React.CSSProperties;
  children: React.ReactNode[];
  activeTabId?: string;
}

interface ActiveTabState {
  tabChildren: React.ReactNode | undefined;
}

export const TabView = ({
  style = {},
  styleCard,
  children,
  activeTabId,
}: TabViewProps) => {
  const [activeTab, setActiveTab] = useState<ActiveTabState>({
    tabChildren: undefined,
  });
  const setActiveTabCallback = useCallback(
    (tab: React.ReactNode) =>
      setActiveTab({
        ...activeTab,
        tabChildren: tab,
      }),
    [activeTab],
  );

  return (
    <TabViewContext.Provider
      value={{
        activeTabId: activeTabId,
        setActiveTab: setActiveTabCallback,
      }}
    >
      <div style={style}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `20px repeat(${children.length}, 1fr) 20px`,
            maxHeight: '100%',
            maxWidth: '100%',
          }}
        >
          <div></div>
          {children}
          <div></div>
          <Card
            style={{
              gridColumn: '1/-1',
              position: 'relative',
              zIndex: zIndexManager.tabs.card,
              ...styleCard,
            }}
          >
            {activeTab.tabChildren}
          </Card>
        </div>
      </div>
    </TabViewContext.Provider>
  );
};

TabView.Item = TabItem;
