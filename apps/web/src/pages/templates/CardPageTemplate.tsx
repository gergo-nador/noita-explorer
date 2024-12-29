import React from 'react';
import { CardPageHeight } from '../../components/CardPageHeight.tsx';
import { useTemplatePageLogic } from '../../hooks/useTemplatePageLogic.tsx';

interface CardPageTemplateProps {
  children?: React.ReactNode | React.ReactNode[];
  style?: React.CSSProperties;
}

export const CardPageTemplate = ({
  children,
  style = {},
}: CardPageTemplateProps) => {
  const templatePageLogic = useTemplatePageLogic();

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
          {templatePageLogic.buttons.map((b) => b.element)}
        </div>
      </div>
    </div>
  );
};
