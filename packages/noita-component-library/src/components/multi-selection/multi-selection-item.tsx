import React, { useContext } from 'react';
import { MultiSelectionContext } from './multi-selection-context.ts';
import { Button } from '../button/button';

export interface MultiSelectionItemProps<T> {
  children: string | React.ReactNode;
  value: T;
  style?: React.CSSProperties;
  onClick?: (value: T, isSelected: boolean) => void;
  selectedProperties?: React.CSSProperties;
}

export const MultiSelectionItem = <T,>({
  children,
  value,
  style,
  onClick,
  selectedProperties,
}: MultiSelectionItemProps<T>) => {
  const { currentValue, setValue, unselectOnClick } = useContext(
    MultiSelectionContext,
  );

  const isSelected = currentValue === value;

  if (isSelected) {
    style = {
      ...style,
      color: 'gold',
      ...(selectedProperties ?? {}),
    };
  }

  return (
    <Button
      onClick={() => {
        if (unselectOnClick && isSelected) {
          setValue(undefined);
        } else {
          setValue(value);
        }

        onClick?.(value, isSelected);
      }}
      className={'cursor-settings-button'}
      style={style}
    >
      {children}
    </Button>
  );
};
