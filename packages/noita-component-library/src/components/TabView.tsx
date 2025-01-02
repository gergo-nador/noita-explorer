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
  initialActiveTabId?: string;
  tabs: TabViewItem[];
  style?: React.CSSProperties;
  styleCard?: React.CSSProperties;
}

export const TabView = ({
  tabs,
  style,
  styleCard,
  initialActiveTabId,
}: TabViewProps) => {
  const [currentTab, setCurrentTab] = React.useState(() => {
    const initialActiveTabIndex = tabs.findIndex(
      (tab) => tab.id === initialActiveTabId,
    );

    const initialTabIndex =
      initialActiveTabIndex === -1 ? 0 : initialActiveTabIndex;

    return {
      index: initialTabIndex,
      content: tabs.length > 0 ? tabs[initialTabIndex].content : undefined,
    };
  });

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
        {tabs.map(({ title, content, onClick }, index) => {
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
                onClick={() => {
                  setCurrentTab({
                    index: index,
                    content: content,
                  });
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
          {currentTab.content}
        </Card>
      </div>
    </div>
  );
};
