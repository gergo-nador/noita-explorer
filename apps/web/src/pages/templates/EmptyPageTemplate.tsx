import { Button } from '@noita-explorer/noita-component-library';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { constants } from '../../constants.ts';

interface EmptyPageTemplateProps {
  children?: React.ReactNode | React.ReactNode[];
  style?: React.CSSProperties;
}

export const EmptyPageTemplate = ({
  children,
  style = {},
}: EmptyPageTemplateProps) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          maxHeight: '100%',
          width: '90%',
        }}
      >
        <div style={{ maxHeight: constants.pageHeight, ...style }}>
          {children}
        </div>

        <div
          style={{
            marginTop: 10,
          }}
        >
          <Button onClick={() => navigate('/')}>Return</Button>
        </div>
      </div>
    </div>
  );
};
