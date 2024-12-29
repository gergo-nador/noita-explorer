import { useBool } from '../../hooks/useBool';
import { zIndexManager } from '../../zIndexManager';
import React from 'react';
import { Tooltip } from 'react-tooltip';
import { Card } from '../Card';
import css from './ActiveIconWrapper.module.css';

interface ActiveProgressIconProps {
  id: string;
  children: React.ReactNode;
  tooltip: React.ReactNode;
}

export const ActiveIconWrapper = ({
  id,
  children,
  tooltip,
}: ActiveProgressIconProps) => {
  const { state, setTrue, setFalse } = useBool();

  const wrapperStyleProps = {
    '--zIndexHover': zIndexManager.progressIconHover,
  } as React.CSSProperties;

  return (
    <>
      {state && (
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
        }}
      >
        <div className={css['active']} style={wrapperStyleProps}>
          {children}
        </div>
      </div>
    </>
  );
};
