import React, { CSSProperties } from 'react';

interface HeaderProps {
  title: string;
  titleCss?: CSSProperties;
  children?: React.ReactNode | React.ReactNode[];
}

export const Header = ({ title, titleCss, children }: HeaderProps) => {
  return (
    <div style={{ marginBottom: 15 }}>
      <div style={{ marginBottom: 15 }}>
        <span className={'text-secondary text-xl'} style={titleCss}>
          {title}
        </span>
      </div>
      <div style={{ paddingLeft: 10 }}>{children}</div>
    </div>
  );
};
