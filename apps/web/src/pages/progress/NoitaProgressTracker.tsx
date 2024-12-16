import {
  ActiveProgressIcon,
  ProgressIcon,
} from '@noita-explorer/noita-component-library';
import { useMemo } from 'react';
import { useNoitaDataWakStore } from '../../stores/NoitaDataWak.ts';
import { NoitaProgressIconTable } from '../../components/NoitaProgressIconTable.tsx';
import { NoitaSpellTooltip } from '../../components/tooltips/NoitaSpellTooltip.tsx';
import { NoitaPerkTooltip } from '../../components/tooltips/NoitaPerkTooltip.tsx';
import { useSave00Store } from '../../stores/save00.ts';
import { NoitaSpellTypesDictionary } from '../../noita/NoitaSpellTypeDictionary.ts';
import { NoitaEnemyGroupTooltip } from '../../components/tooltips/NoitaEnemyGroupTooltip.tsx';
import { useNoitaEnemyGroups } from '../../hooks/useNoitaEnemyGroups.ts';

export const NoitaProgressTracker = () => {
  const { data } = useNoitaDataWakStore();
  const { enemyStatistics, unlockedPerks, unlockedSpells } = useSave00Store();

  const enemies = useNoitaEnemyGroups({
    enemies: data?.enemies,
    enemyStatistics: enemyStatistics,
  });

  const unlockedEnemycount = useMemo(() => {
    if (data?.enemies === undefined) return 0;
    if (enemyStatistics === undefined) return 0;

    return data.enemies.filter((e) => e.id in enemyStatistics).length;
  }, [data, enemyStatistics]);

  if (!data) {
    return <div>Noita Data Wak is not loaded.</div>;
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '9fr 12fr 9fr',
          gap: 10,
        }}
      >
        <NoitaProgressIconTable
          count={data.perks.length}
          name={'Perks'}
          columnCount={9}
          unlocked={unlockedPerks?.length ?? 0}
        >
          {data.perks.map((perk) => (
            <ActiveProgressIcon
              id={'perk-' + perk.id}
              key={'perk-' + perk.id}
              tooltip={
                <NoitaPerkTooltip
                  perk={perk}
                  isUnknown={
                    !(!unlockedPerks || unlockedPerks.includes(perk.id))
                  }
                />
              }
            >
              <ProgressIcon
                type={
                  !unlockedPerks || unlockedPerks.includes(perk.id)
                    ? 'regular'
                    : 'unknown'
                }
                icon={perk.imageBase64}
              />
            </ActiveProgressIcon>
          ))}
        </NoitaProgressIconTable>
        <NoitaProgressIconTable
          count={data.spells.length}
          name={'Spells'}
          columnCount={12}
          unlocked={unlockedSpells?.length ?? 0}
        >
          {data.spells.map((spell) => (
            <ActiveProgressIcon
              id={'spell-' + spell.id}
              key={'spell-' + spell.id}
              tooltip={
                <NoitaSpellTooltip
                  spell={spell}
                  isUnknown={
                    !(!unlockedSpells || unlockedSpells.includes(spell.id))
                  }
                />
              }
            >
              <ProgressIcon
                type={
                  !unlockedSpells || unlockedSpells.includes(spell.id)
                    ? 'regular'
                    : 'unknown'
                }
                icon={spell.imageBase64}
                spellBackground={NoitaSpellTypesDictionary[spell.type].image}
              />
            </ActiveProgressIcon>
          ))}
        </NoitaProgressIconTable>
        <NoitaProgressIconTable
          count={enemies?.length ?? 0}
          name={'Enemies'}
          columnCount={9}
          unlocked={unlockedEnemycount}
        >
          {enemies &&
            enemies.map((e) => (
              <ActiveProgressIcon
                id={'enemy-' + e.enemyGroup.baseId}
                key={'enemy-' + e.enemyGroup.baseId}
                tooltip={
                  <NoitaEnemyGroupTooltip
                    enemyGroup={e.enemyGroup}
                    statistics={e.statistics}
                    isUnknown={
                      !(
                        !enemyStatistics ||
                        e.enemyGroup.enemies.some(
                          (e) => e.id in enemyStatistics,
                        )
                      )
                    }
                  />
                }
              >
                <ProgressIcon
                  type={
                    !enemyStatistics ||
                    e.enemyGroup.enemies.some((e) => e.id in enemyStatistics)
                      ? 'regular'
                      : 'unknown'
                  }
                  icon={e.enemyGroup.imageBase64}
                />
              </ActiveProgressIcon>
            ))}
        </NoitaProgressIconTable>
      </div>
    </>
  );
};
