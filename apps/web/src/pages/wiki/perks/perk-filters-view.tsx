import {
  Card,
  Icon,
  MultiSelectionBooleanNullable,
  MultiSelection,
} from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import { NoitaProtections } from '../../../noita/noita-protections.ts';
import { PerkFilters } from './perk-filters.ts';
import { Dispatch } from 'react';

export const PerkFiltersView = ({
  setFilters,
  filters,
  showSave00RelatedFilters,
  usedProtectionIds,
}: {
  filters: PerkFilters;
  setFilters: Dispatch<PerkFilters>;
  showSave00RelatedFilters: boolean;
  usedProtectionIds: string[];
}) => {
  const MultiSelectString = MultiSelection<string | undefined>();

  return (
    <Card>
      <Flex gap={10} style={{ maxWidth: 'max-content', marginBottom: 10 }}>
        <span>Stackable: </span>
        <MultiSelectionBooleanNullable
          setValue={(value) => setFilters({ ...filters, stackable: value })}
          currentValue={filters.stackable}
        />
      </Flex>
      <Flex gap={10} style={{ maxWidth: 'max-content', marginBottom: 10 }}>
        <span>Holy Mountain: </span>
        <MultiSelectionBooleanNullable
          setValue={(value) => setFilters({ ...filters, holyMountain: value })}
          currentValue={filters.holyMountain}
        />
      </Flex>
      <Flex gap={10} style={{ maxWidth: 'max-content', marginBottom: 10 }}>
        <span>One-Off Effect: </span>
        <MultiSelectionBooleanNullable
          setValue={(value) => setFilters({ ...filters, oneOffEffect: value })}
          currentValue={filters.oneOffEffect}
        />
      </Flex>
      <Flex gap={10} style={{ maxWidth: 'max-content', marginBottom: 10 }}>
        <span>Removed by NA: </span>
        <MultiSelectionBooleanNullable
          setValue={(value) =>
            setFilters({
              ...filters,
              removedByNullifyingAltar: value,
            })
          }
          currentValue={filters.removedByNullifyingAltar}
        />
      </Flex>
      {showSave00RelatedFilters && (
        <Flex gap={10} style={{ maxWidth: 'max-content', marginBottom: 10 }}>
          <span>Unlocked: </span>
          <MultiSelectionBooleanNullable
            setValue={(value) =>
              setFilters({
                ...filters,
                unlocked: value,
              })
            }
            currentValue={filters.unlocked}
          />
        </Flex>
      )}

      <Flex gap={10} style={{ maxWidth: 'max-content' }}>
        <span>Protections:</span>
        <MultiSelectString
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
                <MultiSelectString.Item
                  value={protectionId}
                  style={{ opacity: 0.6 }}
                  selectedProperties={{ opacity: 1 }}
                >
                  <Icon src={protection.image} size={30} />
                </MultiSelectString.Item>
              );
            })}
        </MultiSelectString>
      </Flex>
    </Card>
  );
};
