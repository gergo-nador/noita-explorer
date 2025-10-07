import React from 'react';

type DivHtmlProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface FlexProps {
  style?: React.CSSProperties;
  children: React.ReactNode;
  gap?: React.CSSProperties['gap'];
  wrap?: React.CSSProperties['flexWrap'] | boolean;
  justify?: React.CSSProperties['justifyContent'];
  align?: React.CSSProperties['alignItems'];
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
  direction?: React.CSSProperties['flexDirection'];
  center?: boolean;
  column?: boolean;
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
  ...rest
}: FlexProps & DivHtmlProps) => {
  const baseStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: typeof wrap === 'boolean' ? 'wrap' : wrap,
    gap: gap,
    alignItems: center ? 'center' : align,
    justifyContent: center ? 'center' : justify,
    width,
    height,
    flexDirection: column ? 'column' : direction,
  };

  return (
    <div {...rest} style={{ ...baseStyle, ...style }}>
      {children}
    </div>
  );
};
