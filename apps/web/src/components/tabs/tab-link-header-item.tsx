import React, { useContext } from 'react';
import { TabViewContext } from './tab-view-context.ts';
import { Link } from 'react-router-dom';
import { zIndexManager } from '../../utils/z-index-manager.ts';
import css from './tab-link-header-item.module.css';

export interface TabLinkHeaderItemProps {
  id: string;
  children: string;
  index: number;
  style?: React.CSSProperties;
  to: string;
}

export const TabLinkHeaderItem = ({
  id,
  children,
  index,
  style,
  to,
}: TabLinkHeaderItemProps) => {
  const [isHover, setHover] = React.useState(false);
  const [isFocus, setFocus] = React.useState(false);
  const tabContext = useContext(TabViewContext);
  const isActive = tabContext.activeTabId === id;

  style ??= {};

  return (
    <div
      style={{
        outline: 'none',
        ...style,
        transform: `translateX(-${index * 4}px) translateY(4px)`, // 4px is the width in the css
        position: 'relative',
        zIndex: isActive
          ? zIndexManager.tabs.activeTab
          : isHover || isFocus
            ? zIndexManager.tabs.hoveredTab
            : zIndexManager.tabs.defaultTab,
      }}
      className={css['container']}
      tabIndex={0}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    >
      <Link to={to} style={{ color: 'inherit' }}>
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

          <div
            className={css['content']}
            style={{
              color: isActive ? 'white' : undefined,
            }}
          >
            {children}
          </div>

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
      </Link>
    </div>
  );
};
