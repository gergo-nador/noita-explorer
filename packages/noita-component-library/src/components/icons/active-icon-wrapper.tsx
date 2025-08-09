import { useBool } from '../../hooks/use-bool';
import { ZIndexManager } from '../../z-index-manager';
import React, { CSSProperties } from 'react';
import { Tooltip } from 'react-tooltip';
import { Card } from '../card/card';
import css from './active-icon-wrapper.module.css';

interface ActiveProgressIconProps {
  id: string;
  children: React.ReactNode;
  tooltip: React.ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
}

export const ActiveIconWrapper = ({
  id,
  children,
  tooltip,
  onClick,
  style,
}: ActiveProgressIconProps) => {
  const { state, setTrue, setFalse } = useBool();

  const wrapperStyleProps = {
    '--zIndexHover': ZIndexManager.progressIconHover,
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
            zIndex: ZIndexManager.tooltip,
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
          ...style,
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
