import { PlacesType, Tooltip } from 'react-tooltip';
import React, { useRef, useState } from 'react';
import { Card } from './card/card';
import { ZIndexManager } from '../z-index-manager';
import { randomHelpers } from '@noita-explorer/tools';

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
  const idRef = useRef(`id-${randomHelpers.randomInt(0, 100000000)}`);

  return (
    <>
      {isEnabled && isMouseHovered && (
        <Tooltip
          id={idRef.current}
          style={{
            zIndex: ZIndexManager.tooltip,
            backgroundColor: 'transparent',
            padding: 0,
            maxWidth: '99%',
          }}
          anchorSelect={`#${idRef.current}`}
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
        id={idRef.current}
        onMouseEnter={() => isEnabled && setMouseHovered(true)}
        onMouseLeave={() => isEnabled && setMouseHovered(false)}
        style={{ width: 'fit-content', height: 'fit-content' }}
      >
        {children}
      </div>
    </>
  );
};
