import React from 'react';
import { HeadMeta } from './head-meta.tsx';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const Head = ({ children }: Props) => {
  return <>{children}</>;
};

Head.Meta = HeadMeta;
