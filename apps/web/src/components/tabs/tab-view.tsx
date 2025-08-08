import React from 'react';
import { TabViewContext } from './tab-view-context.ts';
import { TabHeaderGroup } from './tab-header-group.tsx';
import { TabLinkHeaderItem } from './tab-link-header-item.tsx';
import { TabBody } from './tab-body.tsx';

interface TabViewProps {
  style?: React.CSSProperties;
  children: React.ReactNode[];
  activeTabId?: string;
  numberOfTabs: number;
}

export const TabView = ({
  style = {},
  children,
  activeTabId,
  numberOfTabs,
}: TabViewProps) => {
  return (
    <TabViewContext.Provider
      value={{
        activeTabId: activeTabId,
      }}
    >
      <div style={style}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `20px repeat(${numberOfTabs}, 1fr) 20px`,
            maxHeight: '100%',
            maxWidth: '100%',
          }}
        >
          {children}
        </div>
      </div>
    </TabViewContext.Provider>
  );
};

TabView.LinkHeaderItem = TabLinkHeaderItem;
TabView.HeaderGroup = TabHeaderGroup;
TabView.Body = TabBody;
