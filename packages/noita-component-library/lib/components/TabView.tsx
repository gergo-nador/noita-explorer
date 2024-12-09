import { Card } from './Card';
import React from 'react';
import { TabItem } from './TabItem';
import { zIndexManager } from '../../zIndexManager';

interface TabViewItem {
  title: string;
  content: React.ReactNode;
}

interface TabViewProps {
  tabs: TabViewItem[];
}

export const TabView = ({ tabs }: TabViewProps) => {
  const [currentTab, setCurrentTab] = React.useState({
    index: 0,
    content: tabs.length > 0 ? tabs[0].content : undefined,
  });

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `20px repeat(${tabs.length}, 1fr) 20px`,
          padding: '0 10px',
        }}
      >
        <div></div>
        {tabs.map(({ title, content }, index) => {
          const isActive = index === currentTab.index;
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
                onClick={() =>
                  setCurrentTab({
                    index: index,
                    content: content,
                  })
                }
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
          }}
        >
          {currentTab.content}
        </Card>
      </div>
    </div>
  );
};
