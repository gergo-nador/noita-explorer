import { Button } from '@noita-explorer/noita-component-library';
import React from 'react';
import { Flex } from '../Flex.tsx';

interface MultiSelectionOption<T> {
  id: string;
  display: string | React.ReactNode;
  value: T;
  style?: React.CSSProperties;
  onClick?: (optionId: string, isSelected: boolean) => void;
  selectedProperties?: React.CSSProperties;
}

export interface MultiSelectionProps<T> {
  options: MultiSelectionOption<T>[];
  setValue: (value: T) => void;
  currentValue: T;
}

export const MultiSelection = <T,>({
  options,
  setValue,
  currentValue,
}: MultiSelectionProps<T>) => {
  return (
    <Flex style={{ width: 'max-content' }} gap={10}>
      {options.map((option, index) => {
        let style = {
          ...option.style,
        };

        const isSelected = currentValue === option.value;

        if (isSelected) {
          style = {
            ...style,
            color: 'gold',
            ...(option.selectedProperties ?? {}),
          };
        }

        return (
          <>
            <Button
              onClick={() => {
                setValue(option.value);
                if (option.onClick !== undefined) {
                  option.onClick(option.id, isSelected);
                }
              }}
              className={'cursor-settings-button'}
              style={style}
            >
              {option.display}
            </Button>
            {index !== options.length - 1 && <span> / </span>}
          </>
        );
      })}
    </Flex>
  );
};
