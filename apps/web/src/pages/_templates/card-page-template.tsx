import React from 'react';
import { CardPageHeight } from '../../components/card-page-height.tsx';
import { useTemplatePageLogic } from '../../hooks/use-template-page-logic.tsx';
import { Flex } from '../../components/flex.tsx';

interface CardPageTemplateProps {
  children?: React.ReactNode | React.ReactNode[];
  style?: React.CSSProperties;
  returnPath?: string;
}

export const CardPageTemplate = ({
  children,
  style = {},
  returnPath,
}: CardPageTemplateProps) => {
  const templatePageLogic = useTemplatePageLogic(returnPath);

  return (
    <Flex width='100%' height='100%' center column>
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
