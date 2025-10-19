import { PlacesType, Tooltip } from 'react-tooltip';
import React, { useMemo, useState } from 'react';
import { Card } from './card/card';
import { ZIndexManager } from '../z-index-manager';

interface NoitaTooltipProps {
  content: string | React.ReactNode | React.ReactNode[] | undefined;
  placement?: PlacesType;
  children?: React.ReactNode | string | React.ReactNode[];
  isDisabled?: boolean;
}

export const NoitaTooltipWrapper = ({
  content,
  children,
  placement,
  isDisabled,
}: NoitaTooltipProps) => {
  const isEnabled = content !== undefined;
  const [isMouseHovered, setMouseHovered] = useState(false);

  const id = useMemo(() => {
    return 'id-' + Math.floor(Math.random() * 100000000);
  }, []);

  return (
    <>
      {isEnabled && isMouseHovered && (
        <Tooltip
          id={id}
          style={{
            zIndex: ZIndexManager.tooltip,
            backgroundColor: 'transparent',
            padding: 0,
            maxWidth: '99%',
          }}
          anchorSelect={`#${id}`}
          opacity={1}
          isOpen={!isDisabled}
          place={placement}
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
        onMouseEnter={() => isEnabled && setMouseHovered(true)}
        onMouseLeave={() => isEnabled && setMouseHovered(false)}
        style={{ width: 'fit-content', height: 'fit-content' }}
      >
        {children}
      </div>
    </>
  );
};
