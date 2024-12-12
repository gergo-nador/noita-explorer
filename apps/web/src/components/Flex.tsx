import React from 'react';

interface FlexProps {
  style?: React.CSSProperties;
  children: React.ReactNode | React.ReactNode[];
  gap?: number | string;
}

export const Flex = ({ style = {}, children, gap }: FlexProps) => {
  const baseStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: gap,
  };

  return <div style={{ ...baseStyle, ...style }}>{children}</div>;
};
