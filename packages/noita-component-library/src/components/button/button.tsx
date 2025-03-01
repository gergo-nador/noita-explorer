import css from './button.module.css';
import arrowLeft from '../../../assets/button/keyboard_cursor_left_active.png';
import arrowRight from '../../../assets/button/keyboard_cursor_right_active.png';
import React, { MutableRefObject, useRef } from 'react';

export interface ButtonProps {
  children?: string | React.ReactNode | React.ReactNode[];
  className?: string;
  decoration?: 'left' | 'right' | 'both' | 'none';
  disabled?: boolean;
  style?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onDisabledClick?: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const Button = ({
  children,
  className,
  onClick,
  decoration,
  style = {},
  textStyle = {},
  disabled,
  onDisabledClick,
  onMouseEnter,
  onMouseLeave,
  onBlur,
  onFocus,
}: ButtonProps) => {
  const iconSize = 6;
  const buttonRef = useRef<HTMLButtonElement>();

  const buttonOnClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const isMouseClick = e.detail > 0;
    if (isMouseClick) {
      buttonRef.current?.blur();
    }

    if (disabled && typeof onDisabledClick === 'function') {
      onDisabledClick();
      return;
    }

    if (disabled) return;

    if (typeof onClick === 'function') {
      onClick(e);
    } else {
      console.error('button not implemented');
    }
  };

  const leftButton =
    decoration === 'left' || decoration === 'both' || decoration === undefined;
  const rightButton = decoration === 'right' || decoration === 'both';

  return (
    <div className={css['container']}>
      <button
        className={`${css['button-content']} ${className}`}
        onClick={buttonOnClick}
        ref={buttonRef as MutableRefObject<HTMLButtonElement>}
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          ...style,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {leftButton && (
          <span
            className={`${css['icon-container']} ${css['icon-container-left']}`}
          >
            <img
              src={arrowLeft}
              height={iconSize * 2}
              width={iconSize}
              className={css['icon']}
              alt={'Button Arrow'}
            />
          </span>
        )}

        <span
          style={{
            ...textStyle,
            color: disabled ? '#FFFFFFAA' : (textStyle.color ?? 'inherit'),
          }}
        >
          {children}
        </span>

        {rightButton && (
          <span
            className={`${css['icon-container']} ${css['icon-container-right']}`}
          >
            <img
              src={arrowRight}
              height={iconSize * 2}
              width={iconSize}
              className={css['icon']}
              alt={'Button Arrow'}
            />
          </span>
        )}
      </button>
    </div>
  );
};
