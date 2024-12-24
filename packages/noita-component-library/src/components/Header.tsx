import React from 'react';

interface HeaderProps {
  title: string;
  children?: React.ReactNode | React.ReactNode[];
}

export const Header = ({ title, children }: HeaderProps) => {
  return (
    <div style={{ marginBottom: 15 }}>
      <div style={{ marginBottom: 15 }}>
        <span className={'text-secondary text-xl'}>{title}</span>
      </div>
      <div style={{ paddingLeft: 10 }}>{children}</div>
    </div>
  );
};
