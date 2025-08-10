import React, { LegacyRef, useEffect, useRef, useState } from 'react';
import { Icon } from './icon';
import { imageHelpers } from '@noita-explorer/tools';
import css from './inventory-icon.module.css';
import { assetsManager } from '../../assets-manager';

interface InventoryIconProps {
  icon?: string;
  style?: React.CSSProperties;
  size?: number | string;
  spellBackground?: string;
  usesRemaining?: number;
  showWarning?: boolean;
  useOriginalIconSize?: boolean;
}

export const InventoryIcon = ({
  icon,
  size,
  style = {},
  spellBackground,
  usesRemaining,
  showWarning,
  useOriginalIconSize,
}: InventoryIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [imgSize, setImageSize] = useState({ width: 0, height: 0 });

  size ??= '100%';

  useEffect(() => {
    if (!useOriginalIconSize || !icon) {
      return;
    }

    // the inventory icon is 18x18 pixel (not scaled)
    const inventoryIconHeight = ref.current?.clientHeight;
    if (inventoryIconHeight === undefined) {
      return;
    }

    const scale = inventoryIconHeight / 18;

    imageHelpers
      .getImageSizeBase64(icon)
      .then((size: { width: number; height: number }) => {
        setImageSize({
          width: size.width * scale,
          height: size.height * scale,
        });
      });
  }, [icon, size, useOriginalIconSize]);

  return (
    <div
      style={{
        height: typeof size === 'number' ? `${size}px` : size,
        width: typeof size === 'number' ? `${size}px` : size,
        position: 'relative',
        aspectRatio: 1,
        ...style,
      }}
      className={css['container']}
      ref={ref as unknown as LegacyRef<HTMLDivElement>}
    >
      {/* The main background image for every Progress Icon*/}
      <img
        src={assetsManager.get('inventory-boxes/full_inventory_box.png')}
        alt={'background image'}
        style={{
          imageRendering: 'pixelated',
          height: '100%',
          width: '100%',
        }}
        className={css['hide-on-hover']}
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
            alt={'spell image'}
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
            className={css['icon']}
            style={{
              imageRendering: 'pixelated',
              height: useOriginalIconSize ? imgSize.height : '84%', // images are 16x16, background is 18x18 -> 16/18 = 88.8888 %
              width: useOriginalIconSize ? imgSize.width : '84%', // the main image in the inventory is slightly smaller than the spell background
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
