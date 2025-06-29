import {
  Card,
  MultiSelectionBooleanNullable,
} from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import { SpellFilters } from './spell-filters.ts';
import { Dispatch } from 'react';

export const SpellFiltersView = ({
  filters,
  setFilters,
}: {
  filters: SpellFilters;
  setFilters: Dispatch<SpellFilters>;
}) => {
  return (
    <Card>
      <Flex gap={10} style={{ maxWidth: 'max-content', marginBottom: 10 }}>
        <span>Friendly Fire: </span>
        <MultiSelectionBooleanNullable
          setValue={(value) => setFilters({ ...filters, friendlyFire: value })}
          currentValue={filters.friendlyFire}
        />
      </Flex>
    </Card>
  );
};
