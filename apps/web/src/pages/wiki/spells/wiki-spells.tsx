import {
  ActiveIconWrapper,
  Card,
  ProgressIcon,
} from '@noita-explorer/noita-component-library';
import { NoitaSpellTypesDictionary } from '../../../noita/noita-spell-type-dictionary.ts';
import { NoitaProgressIconTable } from '../../../components/noita-progress-icon-table.tsx';
import { NoitaSpell } from '@noita-explorer/model-noita';
import { SpellFiltersView } from './spell-filters-view.tsx';
import { useState } from 'react';
import { SpellFilters } from './spell-filters.ts';
import { Flex } from '@noita-explorer/react-utils';
import { Link, Outlet } from 'react-router-dom';
import { pages } from '../../../routes/pages.ts';
import { publicPaths } from '../../../utils/public-paths.ts';
import { useDataWakService } from '../../../services/data-wak/use-data-wak-service.ts';

export const WikiSpells = () => {
  const { data } = useDataWakService();

  const [filters, setFilters] = useState<SpellFilters>({
    friendlyFire: undefined,
  });

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
                icon={publicPaths.generated.spell.image({ spellId: spell.id })}
                spellBackground={NoitaSpellTypesDictionary[spell.type].image}
              />
            );

            return (
              <div key={spell.id} style={{ opacity: filter ? 1 : 0.35 }}>
                {!filter && icon}
                {filter && (
                  <Link to={pages.wiki.spellDetail(spell.id)}>
                    <ActiveIconWrapper
                      id={'spell-' + spell.id}
                      key={'spell-' + spell.id}
                      tooltip={
                        <div>
                          <div style={{ fontSize: 20 }}>{spell.name}</div>
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
          width: '45%',
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
