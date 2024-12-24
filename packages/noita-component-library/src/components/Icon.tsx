import error_icon from '../../assets/icons/mods_newer.png';
import info_icon from '../../assets/icons/icon_info.png';
import warning_icon from '../../assets/icons/icon_warning.png';
import checkmark from '../../assets/icons/checkmark.png';
import cross_large from '../../assets/icons/cross_red_large.png';
import React from 'react';

interface IconProps {
  type: IconType;
  src?: string;
  alt?: string;
  height?: number;
  width?: number;
  size?: number;
  style?: React.CSSProperties;
}

export const Icon = ({
  type,
  src,
  alt,
  width,
  height,
  size,
  style,
}: IconProps) => {
  const mapping = {
    error: error_icon,
    warning: warning_icon,
    info: info_icon,
    check: checkmark,
    cross: cross_large,
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
