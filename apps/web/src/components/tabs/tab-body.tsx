import { zIndexManager } from '../../utils/z-index-manager.ts';
import { Card } from '@noita-explorer/noita-component-library';
import React, { CSSProperties } from 'react';

interface TabBodyProps {
  children: React.ReactNode;
  style?: CSSProperties;
}

export const TabBody = ({ children, style }: TabBodyProps) => {
  return (
    <Card
      style={{
        gridColumn: '1/-1',
        position: 'relative',
        zIndex: zIndexManager.tabs.card,
        ...style,
      }}
      styleContent={{ padding: 0 }}
    >
      {children}
    </Card>
  );
};
