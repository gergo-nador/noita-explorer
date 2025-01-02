import { Button } from '@noita-explorer/noita-component-library';
import React from 'react';
import { Flex } from './Flex.tsx';

interface MultiSelectionOption<T> {
  text: string;
  value: T;
  style?: React.CSSProperties;
  onClick?: () => void;
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
      {options.map((option, index) => (
        <>
          <Button
            onClick={() => {
              setValue(option.value);
              if (option.onClick !== undefined) {
                option.onClick();
              }
            }}
            className={'cursor-settings-button'}
            style={option.style}
            textStyle={{
              color: currentValue === option.value ? 'gold' : undefined,
            }}
          >
            {option.text}
          </Button>
          {index !== options.length - 1 && <span> / </span>}
        </>
      ))}
    </Flex>
  );
};
