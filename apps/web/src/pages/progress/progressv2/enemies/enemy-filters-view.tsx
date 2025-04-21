import { Card, Icon } from '@noita-explorer/noita-component-library';
import { EnemyFilters } from './enemy-filters.ts';
import { Dispatch } from 'react';
import { MultiSelection } from '../../../../components/multi-selection/MultiSelection.tsx';
import { NoitaProtections } from '../../../../noita/NoitaProtections.ts';

export const EnemyFiltersView = ({
  filters,
  setFilters,
  usedProtectionIds,
}: {
  filters: EnemyFilters;
  setFilters: Dispatch<EnemyFilters>;
  usedProtectionIds: string[];
}) => {
  return (
    <Card>
      <div
        style={{ maxWidth: 'max-content', gap: 10, justifyContent: 'center' }}
      >
        <span>Protections:</span>
        <MultiSelection<string | undefined>
          options={Object.keys(NoitaProtections)
            .filter((p) => usedProtectionIds.includes(p))
            .map((protectionId) => ({
              id: protectionId,
              value: protectionId,
              display: (
                <Icon
                  type={'custom'}
                  src={NoitaProtections[protectionId].image}
                  size={30}
                />
              ),
              style: {
                opacity: 0.6,
              },
              selectedProperties: {
                opacity: 1,
              },
              onClick: (_, isSelected) =>
                isSelected &&
                setFilters({ ...filters, protectionId: undefined }),
            }))}
          setValue={(value) =>
            setFilters({
              ...filters,
              protectionId: value,
            })
          }
          currentValue={filters.protectionId}
        />
      </div>
    </Card>
  );
};
