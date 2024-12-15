import { Tooltip } from 'react-tooltip';
import React, { useMemo } from 'react';
import { Card } from './Card';
import { zIndexManager } from '../zIndexManager';

interface NoitaTooltipProps {
  content: string | React.ReactNode | React.ReactNode[] | undefined;
  children?: React.ReactNode | string | React.ReactNode[];
}

export const NoitaTooltipWrapper = ({
  content,
  children,
}: NoitaTooltipProps) => {
  const id = useMemo(() => {
    return 'id-' + Math.floor(Math.random() * 100000000);
  }, []);

  return (
    <>
      {content !== undefined && (
        <Tooltip
          id={id}
          style={{
            zIndex: zIndexManager.tooltip,
            backgroundColor: 'transparent',
            padding: 0,
            maxWidth: '99%',
          }}
          anchorSelect={`#${id}`}
          opacity={1}
        >
          <Card
            styling={{
              background: '#000000FF',
            }}
          >
            {content}
          </Card>
        </Tooltip>
      )}

      <span id={id}>{children}</span>
    </>
  );
};
