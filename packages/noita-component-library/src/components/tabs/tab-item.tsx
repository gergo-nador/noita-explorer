import css from './tab-item.module.css';
import React, { useContext, useEffect } from 'react';
import { ZIndexManager } from '../../z-index-manager';
import { TabViewContext } from './tab-view-context';

export interface TabItemProps {
  id: string;
  text: string;
  index: number;
  style?: React.CSSProperties;
  onClick?: () => void;
  children: React.ReactNode | React.ReactNode[];
}

export const TabItem = ({
  id,
  text,
  index,
  style,
  onClick,
  children,
}: TabItemProps) => {
  const [isHover, setHover] = React.useState(false);
  const [isFocus, setFocus] = React.useState(false);
  const tabContext = useContext(TabViewContext);
  const isActive = tabContext.activeTabId === id;

  const innerOnClick = () => {
    if (!tabContext.activeTabId) {
      tabContext.setActiveTab(children);
    }

    if (typeof onClick !== 'function') {
      return;
    }
    onClick();
  };

  useEffect(() => {
    if (tabContext.activeTabId === id) {
      tabContext.setActiveTab(children);
    }
  }, [id, children, tabContext.activeTabId]);

  style ??= {};

  return (
    <div
      style={{
        outline: 'none',
        ...style,
        transform: `translateX(-${index * 4}px) translateY(4px)`, // 4px is the width in the css
        position: 'relative',
        zIndex: isActive
          ? ZIndexManager.tabs.activeTab
          : isHover || isFocus
            ? ZIndexManager.tabs.hoveredTab
            : ZIndexManager.tabs.defaultTab,
      }}
      className={css['container']}
      tabIndex={0}
      onClick={innerOnClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    >
      <div
        className={`${css['grid-main']} ${isActive ? css['style-active'] : ''}`}
        style={{
          transform: !isActive ? 'translateY(4px)' : '',
          cursor: 'pointer',
          height: '100%',
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
