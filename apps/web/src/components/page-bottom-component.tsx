import React from 'react';

interface FlexBoxProps {
  style?: React.CSSProperties;
  children?: React.ReactNode | React.ReactNode[];
}

export const PageBottomComponent = ({ style = {}, children }: FlexBoxProps) => {
  return (
    <div
      style={{
        ...{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 30,
          marginTop: 30,
        },
        ...style,
      }}
    >
      {children}
    </div>
  );
};
