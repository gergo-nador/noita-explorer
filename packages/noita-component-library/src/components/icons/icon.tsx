import React from 'react';
import { assetsManager } from '../../assets-manager';

interface IconProps {
  type?: IconType;
  src?: string;
  alt?: string;
  height?: number;
  width?: number;
  size?: number;
  style?: React.CSSProperties;
}

export const Icon = ({
  type = 'custom',
  src,
  alt,
  width,
  height,
  size,
  style,
}: IconProps) => {
  const mapping = {
    error: assetsManager.get('icons/mods_newer.png'),
    warning: assetsManager.get('icons/icon_warning.png'),
    info: assetsManager.get('icons/icon_info.png'),
    check: assetsManager.get('icons/checkmark.png'),
    cross: assetsManager.get('icons/cross_red_large.png'),
    custom: src,
  };

  height = height ?? size;
  width = width ?? size;

  return (
    <img
      src={mapping[type]}
      alt={alt ?? 'Icon'}
      width={width}
      height={height}
      style={{
        imageRendering: 'pixelated',
        ...(style ?? {}),
      }}
    />
  );
};

type IconType = 'error' | 'warning' | 'info' | 'check' | 'cross' | 'custom';
