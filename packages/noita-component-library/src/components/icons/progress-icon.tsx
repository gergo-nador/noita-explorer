import backgroundRegular from '../../../assets/progress-boxes/grid_box.png';
import backgroundUnknown from '../../../assets/progress-boxes/grid_box_unknown.png';
import backgroundLayerNew from '../../../assets/progress-boxes/grid_highlight_new.png';
import React from 'react';
import css from './progress-icon.module.css';

export type ProgressIconType = 'regular' | 'unknown' | 'new';

interface ProgressIconProps {
  icon: string;
  type?: ProgressIconType;
  style?: React.CSSProperties;
  size?: number | string;
  spellBackground?: string;
}

export const ProgressIcon = ({
  icon = '',
  type = 'regular',
  size,
  style = {},
  spellBackground,
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
        aspectRatio: 1,
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
      {!isUnknown && spellBackground && (
        <img
          src={spellBackground}
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
          className={css['progress-icon-new-animation']}
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
