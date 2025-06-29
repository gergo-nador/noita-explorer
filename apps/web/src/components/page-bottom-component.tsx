import React from 'react';
import { Flex } from '@noita-explorer/react-utils';

interface FlexBoxProps {
  style?: React.CSSProperties;
  children?: React.ReactNode | React.ReactNode[];
}

export const PageBottomComponent = ({ style = {}, children }: FlexBoxProps) => {
  const styleInternal: React.CSSProperties = {
    ...style,
    marginTop: 30,
  };

  return (
    <Flex justify='space-between' align='center' gap={30} style={styleInternal}>
      {children}
    </Flex>
  );
};
