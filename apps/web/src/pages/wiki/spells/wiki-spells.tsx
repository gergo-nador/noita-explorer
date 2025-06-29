import {
  ActiveIconWrapper,
  Card,
  ProgressIcon,
} from '@noita-explorer/noita-component-library';
import { NoitaSpellTypesDictionary } from '../../../noita/noita-spell-type-dictionary.ts';
import { NoitaProgressIconTable } from '../../../components/noita-progress-icon-table.tsx';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';
import { NoitaSpell } from '@noita-explorer/model-noita';
import { SpellOverview } from './spell-overview.tsx';
import { SpellFiltersView } from './spell-filters-view.tsx';
import { useState } from 'react';
import { SpellFilters } from './spell-filters.ts';
import { Flex } from '@noita-explorer/react-utils';
import { useStateWithQueryParamsString } from '../../../hooks/query-params/use-state-with-query-params-string.ts';

export const WikiSpells = () => {
  const { data } = useNoitaDataWakStore();

  const [selectedSpell, setSelectedSpell] =
    useStateWithQueryParamsString<NoitaSpell>({
      key: 'spell',
      queryParamValueSelector: (spell) => spell.id,
      findValueBasedOnQueryParam: (spellId) =>
        data?.spells?.find((spell) => spell.id === spellId),
    });

  const [filters, setFilters] = useState<SpellFilters>({
    friendlyFire: undefined,
  });

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
      <div
        style={{
          maxWidth: '700px',
          width: '55%',
        }}
      >
        <SpellFiltersView filters={filters} setFilters={setFilters} />
        <br />
        <NoitaProgressIconTable
          count={data.spells.length}
          name={'Spells'}
          columnCount={12}
        >
          {data.spells.map((spell) => {
            const filter = evaluateFiltersForSpell({ spell, filters });

            const icon = (
              <ProgressIcon
                type={'regular'}
                icon={spell.imageBase64}
                spellBackground={NoitaSpellTypesDictionary[spell.type].image}
              />
            );

            return (
              <div key={spell.id} style={{ opacity: filter ? 1 : 0.35 }}>
                {!filter && icon}
                {filter && (
                  <ActiveIconWrapper
                    id={'spell-' + spell.id}
                    key={'spell-' + spell.id}
                    onClick={() => setSelectedSpell(spell)}
                    tooltip={
                      <div>
                        <div style={{ fontSize: 20 }}>{spell.name}</div>
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
          width: '45%',
          maxWidth: '500px',
          maxHeight: '100%',
          position: 'sticky',
          top: 0,
        }}
      >
        {!selectedSpell && <span>Select a spell</span>}
        {selectedSpell && (
          <SpellOverview key={selectedSpell.id} spell={selectedSpell} />
        )}
      </Card>
    </Flex>
  );
};

const evaluateFiltersForSpell = ({
  spell,
  filters,
}: {
  spell: NoitaSpell;
  filters: SpellFilters;
}) => {
  if (filters.friendlyFire !== undefined) {
    if (filters.friendlyFire !== spell.friendlyFire) {
      return false;
    }
  }

  return true;
};
