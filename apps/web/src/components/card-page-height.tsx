import { Card } from '@noita-explorer/noita-component-library';
import React from 'react';
import { constants } from '../utils/constants.ts';

interface CardPageHeightProps {
  children: React.ReactNode | React.ReactNode[];
  style?: React.CSSProperties;
}

export const CardPageHeight = ({
  children,
  style = {},
}: CardPageHeightProps) => {
  return (
    <Card
      style={{
        maxHeight: constants.pageHeight,
        ...style,
      }}
    >
      {children}
    </Card>
  );
};
