import {
  ActiveIconWrapper,
  Card,
  ProgressIcon,
} from '@noita-explorer/noita-component-library';
import { NoitaProgressIconTable } from '../../../../components/NoitaProgressIconTable.tsx';
import { useNoitaDataWakStore } from '../../../../stores/NoitaDataWak.ts';
import { useMemo, useState } from 'react';
import { NoitaPerk } from '@noita-explorer/model-noita';
import { useSave00Store } from '../../../../stores/save00.ts';
import { arrayHelpers } from '@noita-explorer/tools';
import { useStateWithQueryParamsString } from '../../../../hooks/use-state-with-query-params-string.ts';
import { PerkFilters } from './perk-filters.ts';
import { PerkFiltersView } from './perk-filters-view.tsx';
import { PerkOverview } from './perk-overview.tsx';

export const NoitaProgressV2Perks = () => {
  const { data } = useNoitaDataWakStore();

  const [selectedPerk, setSelectedPerk] =
    useStateWithQueryParamsString<NoitaPerk>({
      key: 'perk',
      queryParamValueSelector: (perk) => perk.id,
      findValueBasedOnQueryParam: (perkId) =>
        data?.perks?.find((perk) => perk.id === perkId),
    });

  const [filters, setFilters] = useState<PerkFilters>({
    stackable: undefined,
    holyMountain: undefined,
    oneOffEffect: undefined,
    removedByNullifyingAltar: undefined,
    protectionId: undefined,
    unlocked: undefined,
  });
  const { unlockedPerks } = useSave00Store();

  const usedProtectionIds = useMemo(() => {
    if (data?.perks === undefined) {
      return [];
    }

    const gameEffects = data.perks.map((p) => p.gameEffects).flat();
    return arrayHelpers.unique(gameEffects);
  }, [data?.perks]);

  if (!data) {
    return <div>Noita Data Wak is not loaded.</div>;
  }

  const evaluateFiltersForPerk = (perk: NoitaPerk) => {
    if (filters.stackable !== undefined) {
      if (filters.stackable !== perk.stackable) {
        return false;
      }
    }

    if (filters.holyMountain !== undefined) {
      if (filters.holyMountain !== !perk.notInDefaultPerkPool) {
        return false;
      }
    }

    if (filters.oneOffEffect !== undefined) {
      if (filters.oneOffEffect !== perk.oneOffEffect) {
        return false;
      }
    }

    if (filters.removedByNullifyingAltar !== undefined) {
      if (filters.removedByNullifyingAltar !== !perk.doNotRemove) {
        return false;
      }
    }

    if (filters.protectionId !== undefined) {
      if (!perk.gameEffects.includes(filters.protectionId)) {
        return false;
      }
    }

    if (filters.unlocked !== undefined && unlockedPerks !== undefined) {
      if (!(filters.unlocked || !unlockedPerks.includes(perk.id))) {
        return false;
      }
    }

    return true;
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
        margin: 'auto',
        maxHeight: '100%',
        overflowY: 'auto',
        padding: 15,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          width: '50%',
        }}
      >
        <PerkFiltersView
          setFilters={setFilters}
          filters={filters}
          showSave00RelatedFilters={unlockedPerks !== undefined}
          usedProtectionIds={usedProtectionIds}
        />
        <br />
        <NoitaProgressIconTable
          count={data.spells.length}
          name={'Spells'}
          columnCount={9}
          iconGap={4}
        >
          {data.perks.map((perk) => {
            const filter = evaluateFiltersForPerk(perk);
            const icon = (
              <ProgressIcon type={'regular'} icon={perk.imageBase64} />
            );

            return (
              <div
                key={perk.id}
                style={{
                  opacity: filter ? 1 : 0.35,
                }}
              >
                {!filter && icon}
                {filter && (
                  <ActiveIconWrapper
                    id={'perk-' + perk.id}
                    key={'perk-' + perk.id}
                    onClick={() => setSelectedPerk(perk)}
                    tooltip={
                      <div>
                        <div style={{ fontSize: 20 }}>{perk.name}</div>
                      </div>
                    }
                  >
                    {icon}
                  </ActiveIconWrapper>
                )}
              </div>
            );
          })}
        </NoitaProgressIconTable>
      </div>

      <Card
        style={{
          width: '50%',
          maxWidth: '500px',
          maxHeight: '100%',
          position: 'sticky',
          top: 0,
        }}
      >
        {!selectedPerk && <span>Select a perk</span>}
        {selectedPerk && <PerkOverview perk={selectedPerk} />}
      </Card>
    </div>
  );
};
