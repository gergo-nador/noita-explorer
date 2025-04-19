import React from 'react';
import { constants } from '../../constants.ts';
import { useTemplatePageLogic } from '../../hooks/useTemplatePageLogic';

interface EmptyPageTemplateProps {
  children?: React.ReactNode | React.ReactNode[];
  style?: React.CSSProperties;
  returnPath?: string;
}

export const EmptyPageTemplate = ({
  children,
  style = {},
  returnPath,
}: EmptyPageTemplateProps) => {
  const templatePageLogic = useTemplatePageLogic(returnPath);

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
          {templatePageLogic.buttons.map((b) => b.element)}
        </div>
      </div>
    </div>
  );
};
