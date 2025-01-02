import { Card } from './Card';
import React from 'react';
import { TabItem } from './TabItem';
import { zIndexManager } from '../zIndexManager.ts';

interface TabViewItem {
  id: string;
  title: string;
  onClick?: () => void;
  content: React.ReactNode;
}

interface TabViewProps {
  activeTabId: string;
  tabs: TabViewItem[];
  style?: React.CSSProperties;
  styleCard?: React.CSSProperties;
}

export const TabView = ({
  tabs,
  style,
  styleCard,
  activeTabId,
}: TabViewProps) => {
  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTabId);

  return (
    <div style={style}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `20px repeat(${tabs.length}, 1fr) 20px`,
          maxHeight: '100%',
          maxWidth: '100%',
        }}
      >
        <div></div>
        {tabs.map(({ id, title, onClick }, index) => {
          const isActive = id === activeTabId;
          return (
            <div>
              <TabItem
                key={title}
                text={title}
                style={{
                  transform: `translateX(-${index * 4}px) translateY(4px)`,
                  position: 'relative',
                }}
                isActive={isActive}
                onClick={() => {
                  if (typeof onClick === 'function') onClick();
                }}
              />
            </div>
          );
        })}
        <div></div>
        <Card
          style={{
            gridColumn: '1/-1',
            position: 'relative',
            zIndex: zIndexManager.tabs.card,
            ...styleCard,
          }}
        >
          {activeTabIndex !== -1 ? tabs[activeTabIndex].content : ''}
        </Card>
      </div>
    </div>
  );
};
