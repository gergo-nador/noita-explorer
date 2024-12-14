import css from './Card.module.css';
import React from 'react';

interface CardProps {
  children?: React.ReactNode | React.ReactNode[] | string;
  color?: 'gray' | 'gold';

  styling?: {
    borderBright?: string;
    borderDark?: string;
    background?: string;
    backgroundImage?: string;
    content?: string;
  };
  style?: React.CSSProperties;
  styleContent?: React.CSSProperties;
}

export const Card = ({
  children,
  color = 'gray',
  styling,
  style = {},
  styleContent = {},
}: CardProps) => {
  // based on data/ui_gfx/decorations/9piece0.png

  const customStyles: { [key: string]: string } = {};

  if (styling?.borderDark !== undefined) {
    customStyles['--border-dark'] = styling.borderDark;
  }
  if (styling?.borderBright !== undefined) {
    customStyles['--border-bright'] = styling.borderBright;
  }
  if (styling?.background !== undefined) {
    customStyles['--background'] = styling.background;
  }
  if (styling?.content !== undefined) {
    customStyles['--content'] = styling.content;
  }

  if (styling?.backgroundImage !== undefined) {
    customStyles['--background'] = 'transparent';
    customStyles['background'] = `url(${styling.backgroundImage})`;
  }

  return (
    <div
      className={`${css['grid-main']} ${css[color === 'gray' ? 'style-gray' : 'style-gold']}`}
      style={{
        ...(customStyles as React.CSSProperties),
        ...style,
      }}
    >
      <div className={css['border-bright']}></div>
      <div className={css['grid-top-row']}>
        <div className={css['border-dark']}></div>
        <div className={css['border-bright']}></div>
      </div>
      <div></div>
      <div className={css['grid-left-column']}>
        <div className={css['border-dark']}></div>
        <div className={css['border-bright']}></div>
      </div>
      <div
        className={css['content']}
        style={{
          ...styleContent,
          maxHeight: '100%',
          maxWidth: '100%',
          overflowY: 'auto',
        }}
      >
        {children}
      </div>
      <div className={css['grid-right-column']}>
        <div className={css['border-bright']}></div>
        <div className={css['border-dark']}></div>
      </div>
      <div></div>
      <div className={css['grid-bottom-column']}>
        <div className={css['border-bright']}></div>
        <div className={css['border-dark']}></div>
      </div>
      <div className={css['border-bright']}></div>
    </div>
  );
};
