import { useBool } from '../../hooks/use-bool';
import { zIndexManager } from '../../zIndexManager';
import React from 'react';
import { Tooltip } from 'react-tooltip';
import { Card } from '../card/card';
import css from './active-icon-wrapper.module.css';

interface ActiveProgressIconProps {
  id: string;
  children: React.ReactNode;
  tooltip: React.ReactNode;
  onClick?: () => void;
}

export const ActiveIconWrapper = ({
  id,
  children,
  tooltip,
  onClick,
}: ActiveProgressIconProps) => {
  const { state, setTrue, setFalse } = useBool();

  const wrapperStyleProps = {
    '--zIndexHover': zIndexManager.progressIconHover,
  } as React.CSSProperties;

  return (
    <>
      {state && tooltip && (
        <Tooltip
          place='bottom'
          offset={10}
          anchorSelect={`#${id}`}
          isOpen={true}
          style={{
            zIndex: zIndexManager.tooltip,
            backgroundColor: 'transparent',
            padding: 0,
            maxWidth: '99%',
          }}
        >
          <Card styling={{ background: '#000000FF' }}>{tooltip}</Card>
        </Tooltip>
      )}

      <div
        id={id}
        onMouseEnter={() => setTrue()}
        onMouseLeave={() => setFalse()}
        style={{
          aspectRatio: 1,
          cursor: onClick !== undefined ? 'pointer' : 'auto',
        }}
        onClick={onClick}
      >
        <div className={css['active']} style={wrapperStyleProps}>
          {children}
        </div>
      </div>
    </>
  );
};
