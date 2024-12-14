import { Button, Card } from '@noita-explorer/noita-component-library';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PageBaseCardProps {
  children?: React.ReactNode | React.ReactNode[];
  style?: React.CSSProperties;
}

export const DefaultPageTemplate = ({
  children,
  style = {},
}: PageBaseCardProps) => {
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
        <Card
          style={{
            maxHeight: '80vh',
            ...style,
          }}
        >
          {children}
        </Card>

        <div
          style={{
            marginTop: 10,
          }}
        >
          <Button onClick={() => navigate(-1)}>Leave</Button>
        </div>
      </div>
    </div>
  );
};
