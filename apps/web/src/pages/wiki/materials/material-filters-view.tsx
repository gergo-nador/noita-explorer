import { MaterialFilters } from './material-filters.ts';
import { Dispatch } from 'react';
import { Card } from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import { MultiSelection } from '../../../components/multi-selection/multi-selection.tsx';
import { stringHelpers } from '@noita-explorer/tools';

interface Props {
  filters: MaterialFilters;
  setFilters: Dispatch<MaterialFilters>;
  allAvailableTags: string[];
}

export const MaterialFiltersView = ({
  filters,
  setFilters,
  allAvailableTags,
}: Props) => {
  return (
    <Card>
      <Flex gap={10} style={{ maxWidth: 'max-content', marginBottom: 10 }}>
        <span>Tags: </span>
        <MultiSelection<string>
          setValue={(value) => setFilters({ ...filters, tag: value })}
          currentValue={filters.tag}
          options={allAvailableTags.map((tag) => ({
            id: tag,
            display:
              tag === '[*]'
                ? 'all'
                : stringHelpers.trim({
                    text: tag,
                    fromStart: '[',
                    fromEnd: ']',
                  }),
            value: tag,
          }))}
        />
      </Flex>
    </Card>
  );
};
