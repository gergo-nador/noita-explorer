import css from './TabItem.module.css';
import React from 'react';
import { zIndexManager } from '../../zIndexManager';

interface TabItemProps {
  text: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  isActive?: boolean;
}

export const TabItem = ({ text, style, onClick, isActive }: TabItemProps) => {
  const [isHover, setHover] = React.useState(false);

  const innerOnClick = () => {
    if (typeof onClick !== 'function') return;

    onClick();
  };

  style ??= {};

  return (
    <div
      style={{
        ...style,
        zIndex: isActive
          ? zIndexManager.tabs.activeTab
          : isHover
            ? zIndexManager.tabs.hoveredTab
            : zIndexManager.tabs.defaultTab,
      }}
      onClick={innerOnClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={`${css['grid-main']} ${isActive ? css['style-active'] : ''} ${!isActive && isHover ? css['style-hover'] : ''}`}
        style={{
          transform: !isActive ? 'translateY(4px)' : '',
          cursor: 'pointer',
        }}
      >
        <div className={css['grid-main-corner']}>
          <div></div>
          <div></div>
          <div></div>
          <div className={css['border-bright-color']}></div>
        </div>
        <div className={css['grid-horizontal-border']}>
          <div className={css['border-dark-color']}></div>
          <div className={css['background-color']}></div>
        </div>
        <div className={css['grid-main-corner']}>
          <div></div>
          <div></div>
          <div className={css['border-bright-color']}></div>
          <div></div>
        </div>
        <div className={css['grid-vertical-border']}>
          <div className={css['border-dark-color']}></div>
          <div className={css['background-color']}></div>
        </div>
        <div className={css['content']}>{text}</div>
        <div className={css['grid-vertical-border']}>
          <div className={css['background-color']}></div>
          <div className={css['border-dark-color']}></div>
        </div>
        <div className={css['grid-bottom-corner']}>
          <div className={css['border-dark-color']}></div>
          <div className={css['border-bottom-color']}></div>
        </div>
        <div className={css['border-bottom-color']}></div>
        <div className={css['grid-bottom-corner']}>
          <div className={css['border-bottom-color']}></div>
          <div className={css['border-dark-color']}></div>
        </div>
      </div>
    </div>
  );
};
