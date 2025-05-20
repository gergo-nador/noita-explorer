import { Card } from '@noita-explorer/noita-component-library';

import React from 'react';
import { Flex } from './flex.tsx';

interface PageBaseCardProps {
  children?: React.ReactNode | React.ReactNode[];
  style?: React.CSSProperties;
}

export const PageBaseCard = ({ children, style }: PageBaseCardProps) => {
  style ??= {};

  return (
    <Flex
      center
      style={{
        minWidth: '100%',
        minHeight: '100%',
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
    </Flex>
  );
};
