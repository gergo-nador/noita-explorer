import React, { MouseEventHandler } from 'react';

interface FlexProps {
  style?: React.CSSProperties;
  children: React.ReactNode | React.ReactNode[];
  gap?: React.CSSProperties['gap'];
  wrap?: React.CSSProperties['flexWrap'];
  justify?: React.CSSProperties['justifyContent'];
  align?: React.CSSProperties['alignItems'];
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
  direction?: React.CSSProperties['flexDirection'];
  center?: boolean;
  column?: boolean;
  title?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const Flex = ({
  style = {},
  children,
  gap,
  wrap,
  align,
  justify,
  width,
  height,
  direction,
  center,
  column,
  title,
  onClick,
}: FlexProps) => {
  const baseStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: wrap,
    gap: gap,
    alignItems: center ? 'center' : align,
    justifyContent: center ? 'center' : justify,
    width,
    height,
    flexDirection: column ? 'column' : direction,
  };

  return (
    <div style={{ ...baseStyle, ...style }} title={title} onClick={onClick}>
      {children}
    </div>
  );
};
