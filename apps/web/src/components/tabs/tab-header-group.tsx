import React from 'react';

interface TabHeaderGroupProps {
  children: React.ReactNode[];
}

export const TabHeaderGroup = ({ children }: TabHeaderGroupProps) => {
  return (
    <>
      <div></div>
      {children}
      <div></div>
    </>
  );
};
