import { Tooltip } from 'react-tooltip';
import React, { useMemo, useState } from 'react';
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
  const [isMouseHovered, setMouseHovered] = useState(false);

  const id = useMemo(() => {
    return 'id-' + Math.floor(Math.random() * 100000000);
  }, []);

  return (
    <>
      {content !== undefined && isMouseHovered && (
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
          isOpen={true}
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

      <div
        id={id}
        onMouseEnter={() => setMouseHovered(true)}
        onMouseLeave={() => setMouseHovered(false)}
        style={{ width: 'fit-content' }}
      >
        {children}
      </div>
    </>
  );
};
