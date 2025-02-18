import backgroundRegular from '../../../assets/inventory-boxes/full_inventory_box.png';
import React from 'react';
import { Icon } from './icon';

interface InventoryIconProps {
  icon?: string;
  style?: React.CSSProperties;
  size?: number | string;
  spellBackground?: string;
  usesRemaining?: number;
  showWarning?: boolean;
}

export const InventoryIcon = ({
  icon,
  size,
  style = {},
  spellBackground,
  usesRemaining,
  showWarning,
}: InventoryIconProps) => {
  const backgroundImage = backgroundRegular;

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
      {spellBackground && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={spellBackground}
            alt={'bg image'}
            style={{
              height: '88.88888%', // images are 16x16, background is 18x18 -> 16/18 = 88.8888 %
              width: '88.88888%',
              imageRendering: 'pixelated',
            }}
          />
        </div>
      )}

      {/* Main image */}
      {icon && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={icon}
            alt={'main image'}
            style={{
              imageRendering: 'pixelated',
              height: '84%', // images are 16x16, background is 18x18 -> 16/18 = 88.8888 %
              width: '84%', // the main image in the inventory is slightly smaller than the spell background
            }}
          />
        </div>
      )}

      {usesRemaining !== undefined && usesRemaining >= 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            fontSize: 14,
            paddingLeft: 2,
          }}
          className={'font-noita-small-numbers'}
        >
          {usesRemaining}
        </div>
      )}

      {showWarning && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',

            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Icon
            type={'warning'}
            style={{
              width: '60%',
              transform: 'translateY(-80%)',
            }}
          />
        </div>
      )}
    </div>
  );
};
