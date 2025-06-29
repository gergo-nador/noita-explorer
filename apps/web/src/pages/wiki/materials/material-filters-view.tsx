import { MaterialFilters } from './material-filters.ts';
import { Dispatch } from 'react';
import { Card, MultiSelection } from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
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
  const MultiSelectString = MultiSelection<string | undefined>();

  return (
    <Card>
      <Flex gap={10} style={{ maxWidth: 'max-content', marginBottom: 10 }}>
        <span>Tags: </span>
        <MultiSelectString
          setValue={(value) => setFilters({ ...filters, tag: value })}
          currentValue={filters.tag}
          unselectOnClick
        >
          {allAvailableTags.map((tag) => (
            <MultiSelectString.Item value={tag}>
              {tag === '[*]'
                ? 'all'
                : stringHelpers.trim({
                    text: tag,
                    fromStart: '[',
                    fromEnd: ']',
                  })}
            </MultiSelectString.Item>
          ))}
        </MultiSelectString>
      </Flex>
    </Card>
  );
};
