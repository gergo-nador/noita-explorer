import backgroundRegular from '../../../assets/progress-boxes/grid_box.png';
import backgroundUnknown from '../../../assets/progress-boxes/grid_box_unknown.png';
import backgroundLayerNew from '../../../assets/progress-boxes/grid_highlight_new.png';
import React from 'react';
import css from './ProgressIcon.module.css';

import { NoitaSpellTypesDictionary } from '../../../common';
import { zIndexManager } from '../../zIndexManager';
import { Tooltip } from 'react-tooltip';
import { Card } from './Card';
import { useBool } from '../../hooks/useBool';

interface ProgressIconProps {
  type: 'regular' | 'unknown' | 'new';
  icon: string;
  style?: React.CSSProperties;
  size?: number | string;
  spellItemTypeId?: string;
}

export const ProgressIcon = ({
  icon = '',
  type = 'regular',
  size,
  style = {},
  spellItemTypeId,
}: ProgressIconProps) => {
  const backgroundImage =
    type === 'unknown' ? backgroundUnknown : backgroundRegular;
  const isUnknown = type === 'unknown';

  size ??= '100%';

  return (
    <div
      style={{
        height: typeof size === 'number' ? `${size}px` : size,
        width: typeof size === 'number' ? `${size}px` : size,
        position: 'relative',
        ...style,
      }}
      className={css['wrapper']}
    >
      {/* The main background image for every Progress Icon*/}
      <img
        src={backgroundImage}
        alt={'background image'}
        style={{
          imageRendering: 'pixelated',
          height: '100%',
          width: '100%',
        }}
      />

      {/* Specific background for the different types of spells on top
        of the main background */}
      {!isUnknown &&
        spellItemTypeId &&
        spellItemTypeId in NoitaSpellTypesDictionary && (
          <img
            src={NoitaSpellTypesDictionary[spellItemTypeId].image}
            alt={'bg image'}
            style={{
              position: 'absolute',
              height: '94.11765%', // images are 16x16, background is 17x17 -> 16/17 = 94.11765
              width: '94.11765%',
              top: 0,
              left: 0,
              imageRendering: 'pixelated',
              opacity: 0.6,
            }}
          />
        )}

      {/* Main image */}
      {!isUnknown && (
        <img
          src={icon}
          alt={'main image'}
          style={{
            imageRendering: 'pixelated',
            height: '94.11765%', // images are 16x16, background is 17x17 -> 16/17 = 94.11765
            width: '94.11765%',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      )}

      {/* New progress indicator */}
      {type === 'new' && (
        <img
          src={backgroundLayerNew}
          alt={'background image'}
          style={{
            imageRendering: 'pixelated',
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      )}
    </div>
  );
};

interface ActiveProgressIconProps {
  id: string;
  children: React.ReactNode;
  tooltip: React.ReactNode;
}

export const ActiveProgressIcon = ({
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
