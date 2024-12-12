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
        minWidth: '100%',
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        style={{
          padding: 10,
          maxWidth: '95%',
          maxHeight: '90%',
          ...style,
        }}
      >
        {children}
      </Card>

      <div>
        <Button onClick={() => navigate(-1)}>Leave</Button>
      </div>
    </div>
  );
};
