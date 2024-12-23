import { Button } from '@noita-explorer/noita-component-library';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardPageHeight } from '../../components/CardPageHeight.tsx';

interface CardPageTemplateProps {
  children?: React.ReactNode | React.ReactNode[];
  style?: React.CSSProperties;
}

export const CardPageTemplate = ({
  children,
  style = {},
}: CardPageTemplateProps) => {
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
        <CardPageHeight style={style}>{children}</CardPageHeight>

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
