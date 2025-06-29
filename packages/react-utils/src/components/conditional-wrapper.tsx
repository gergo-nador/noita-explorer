import React from 'react';

interface Props {
  condition: boolean;
  wrapper: (children: React.ReactNode) => React.ReactNode;
  children: React.ReactNode;
}

export const ConditionalWrapper = ({ children, condition, wrapper }: Props) =>
  condition ? wrapper(children) : children;
