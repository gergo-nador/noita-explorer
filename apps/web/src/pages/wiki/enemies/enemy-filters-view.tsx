import {
  Card,
  Icon,
  MultiSelection,
} from '@noita-explorer/noita-component-library';
import { EnemyFilters } from './enemy-filters.ts';
import { Dispatch } from 'react';
import { NoitaProtections } from '../../../noita/noita-protections.ts';

export const EnemyFiltersView = ({
  filters,
  setFilters,
  usedProtectionIds,
}: {
  filters: EnemyFilters;
  setFilters: Dispatch<EnemyFilters>;
  usedProtectionIds: string[];
}) => {
  const MultiSelectionString = MultiSelection<string | undefined>();

  return (
    <Card>
      <div style={{ gap: 10, justifyContent: 'center' }}>
        <span>Protections:</span>
        <MultiSelectionString
          setValue={(value) =>
            setFilters({
              ...filters,
              protectionId: value,
            })
          }
          currentValue={filters.protectionId}
          unselectOnClick
        >
          {Object.keys(NoitaProtections)
            .filter((p) => usedProtectionIds.includes(p))
            .map((protectionId) => {
              const protection = NoitaProtections[protectionId];
              return (
                <MultiSelectionString.Item
                  value={protectionId}
                  style={{ opacity: 0.6 }}
                  selectedProperties={{ opacity: 1 }}
                >
                  <Icon type={'custom'} src={protection.image} size={30} />
                </MultiSelectionString.Item>
              );
            })}
        </MultiSelectionString>
      </div>
    </Card>
  );
};
