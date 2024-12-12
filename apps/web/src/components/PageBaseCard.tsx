import { Card } from '@noita-explorer/noita-component-library';

import React from 'react';

interface PageBaseCardProps {
  children?: React.ReactNode | React.ReactNode[];
  style?: React.CSSProperties;
}

export const PageBaseCard = ({ children, style }: PageBaseCardProps) => {
  style ??= {};

  return (
    <div
      style={{
        minWidth: '100%',
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        style={{
          padding: 10,
          ...style,
        }}
      >
        {children}
      </Card>
    </div>
  );
};
