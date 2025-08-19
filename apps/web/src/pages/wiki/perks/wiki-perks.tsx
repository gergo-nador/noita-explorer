import {
  ActiveIconWrapper,
  Card,
  ProgressIcon,
} from '@noita-explorer/noita-component-library';
import { NoitaProgressIconTable } from '../../../components/noita-progress-icon-table.tsx';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';
import { useMemo, useState } from 'react';
import { NoitaPerk } from '@noita-explorer/model-noita';
import { useSave00Store } from '../../../stores/save00.ts';
import { arrayHelpers } from '@noita-explorer/tools';
import { PerkFilters } from './perk-filters.ts';
import { PerkFiltersView } from './perk-filters-view.tsx';
import { Flex } from '@noita-explorer/react-utils';
import { Link, Outlet } from 'react-router-dom';
import { pages } from '../../../routes/pages.ts';
import { publicPaths } from '../../../utils/public-paths.ts';

export const WikiPerks = () => {
  const { data } = useNoitaDataWakStore();

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

  return (
    <Flex
      justify='center'
      gap={20}
      style={{
        margin: 'auto',
        maxHeight: '100%',
        overflowY: 'auto',
        padding: 15,
        boxSizing: 'border-box',
      }}
    >
      <aside
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
          count={data.perks.length}
          name={'Perks'}
          columnCount={9}
          iconGap={4}
        >
          {data.perks.map((perk) => {
            const filter = evaluateFiltersForPerk({
              perk,
              filters,
              unlockedPerks,
            });
            const icon = (
              <ProgressIcon
                type={'regular'}
                icon={publicPaths.generated.perk.image({ perkId: perk.id })}
              />
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
                  <Link to={pages.wiki.perkDetail(perk.id)}>
                    <ActiveIconWrapper
                      id={'perk-' + perk.id}
                      key={'perk-' + perk.id}
                      tooltip={
                        <div>
                          <div style={{ fontSize: 20 }}>{perk.name}</div>
                        </div>
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      {icon}
                    </ActiveIconWrapper>
                  </Link>
                )}
              </div>
            );
          })}
        </NoitaProgressIconTable>
      </aside>

      <Card
        style={{
          width: '50%',
          maxWidth: '500px',
          maxHeight: '100%',
          position: 'sticky',
          top: 0,
        }}
      >
        <Outlet />
      </Card>
    </Flex>
  );
};

const evaluateFiltersForPerk = ({
  perk,
  filters,
  unlockedPerks,
}: {
  perk: NoitaPerk;
  filters: PerkFilters;
  unlockedPerks: string[] | undefined;
}) => {
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
