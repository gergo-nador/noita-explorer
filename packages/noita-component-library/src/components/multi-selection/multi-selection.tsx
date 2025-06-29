import React from 'react';
import { Flex } from '@noita-explorer/react-utils';
import { MultiSelectionContext } from './multi-selection-context.ts';
import {
  MultiSelectionItem,
  MultiSelectionItemProps,
} from './multi-selection-item.tsx';

interface MultiSelectionProps<T> {
  children: React.ReactNode[];
  setValue: (value: T) => void;
  currentValue: T | undefined;
  /**
   * If set to true, pressing a selected item will unselect it (new value will be undefined)
   */
  unselectOnClick?: boolean;
}

const createMultiSelectionComponent = <T,>() => {
  const MultiSelection = ({
    setValue,
    currentValue,
    children,
    unselectOnClick,
  }: MultiSelectionProps<T>) => {
    return (
      <MultiSelectionContext.Provider
        value={{
          currentValue: currentValue,
          setValue: (value) => setValue(value as T),
          unselectOnClick: unselectOnClick ?? false,
        }}
      >
        <Flex style={{ flexWrap: 'wrap' }} gap={10}>
          {children.map((option, index) => {
            return (
              <div key={index} style={{ display: 'contents' }}>
                {option}
                {index !== children.length - 1 && <span> / </span>}
              </div>
            );
          })}
        </Flex>
      </MultiSelectionContext.Provider>
    );
  };

  MultiSelection.Item = MultiSelectionItem<T>;

  return MultiSelection;
};

type MultiSelectionType<T> = ((
  props: MultiSelectionProps<T>,
) => React.ReactNode) & {
  Item: (props: MultiSelectionItemProps<T>) => React.ReactNode;
};

export const MultiSelection = <T,>() =>
  createMultiSelectionComponent<T>() as MultiSelectionType<T>;
