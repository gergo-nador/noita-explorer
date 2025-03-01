import css from './card.module.css';
import React from 'react';

/**
 * Props for the Card component, allowing customization of appearance and content.
 */
export interface CardProps {
  /**
   * The content inside the card.
   * It can be a string, a single React element, or an array of React elements.
   */
  children?: React.ReactNode | React.ReactNode[] | string;

  /**
   * Predefined color options for the card.
   * - `'gray'` - A neutral gray background.
   * - `'gold'` - A golden-colored background.
   */
  color?: 'gray' | 'gold';

  /**
   * Custom styling options for the card's visual properties.
   */
  styling?: {
    /**
     * The color of the bright border.
     */
    borderBright?: string;

    /**
     * The color of the dark border.
     */
    borderDark?: string;

    /**
     * Background color of the card.
     */
    background?: string;

    /**
     * Background image URL.
     */
    backgroundImage?: string;

    /**
     * Additional content styling (e.g., text color, font).
     */
    content?: string;
  };

  /**
   * Custom inline styles for the card container.
   * Accepts a standard React CSS properties object.
   */
  style?: React.CSSProperties;

  /**
   * Custom inline styles for the card content.
   * Useful for adjusting text color, font size, and layout inside the card.
   */
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
