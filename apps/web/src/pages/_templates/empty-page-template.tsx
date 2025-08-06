import React from 'react';
import { constants } from '../../utils/constants.ts';
import { useTemplatePageLogic } from '../../hooks/use-template-page-logic.tsx';
import { Flex } from '@noita-explorer/react-utils';

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
    <Flex width='100%' height='100%' center column>
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
          {templatePageLogic.buttons.map((b) => (
            <div key={b.id} style={{ display: 'contents' }}>
              {b.element}
            </div>
          ))}
        </div>
      </div>
    </Flex>
  );
};
