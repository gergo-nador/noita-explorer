import {
  ActiveIconWrapper,
  ProgressIcon,
  ProgressIconType,
} from '@noita-explorer/noita-component-library';
import { useMemo, useState } from 'react';
import { useNoitaDataWakStore } from '../../stores/NoitaDataWak.ts';
import { NoitaProgressIconTable } from '../../components/NoitaProgressIconTable.tsx';
import { NoitaSpellTooltip } from '../../components/tooltips/NoitaSpellTooltip.tsx';
import { NoitaPerkTooltip } from '../../components/tooltips/NoitaPerkTooltip.tsx';
import { useSave00Store } from '../../stores/save00.ts';
import { NoitaSpellTypesDictionary } from '../../noita/NoitaSpellTypeDictionary.ts';
import { NoitaEnemyGroupTooltip } from '../../components/tooltips/NoitaEnemyGroupTooltip.tsx';
import { useNoitaEnemyGroups } from '../../hooks/useNoitaEnemyGroups.ts';
import { arrayHelpers } from '@noita-explorer/tools';
import { MultiSelectionBoolean } from '../../components/multi-selection/MultiSelectionBoolean.tsx';

export const NoitaProgressTracker = () => {
  const { data } = useNoitaDataWakStore();
  const { enemyStatistics, unlockedPerks, unlockedSpells, currentRun } =
    useSave00Store();

  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(true);

  const enemies = useNoitaEnemyGroups({
    enemies: data?.enemies,
    enemyStatistics: enemyStatistics,
  });

  const unlockedEnemycount = useMemo(() => {
    if (data?.enemies === undefined) return 0;
    if (enemyStatistics === undefined) return 0;

    return data.enemies
      .filter((e) => e.id in enemyStatistics)
      .filter((e) => enemyStatistics[e.id].enemyDeathByPlayer > 0).length;
  }, [data, enemyStatistics]);

  if (!data) {
    return <div>Noita Data Wak is not loaded.</div>;
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 20,
          color: '#ffffffaa',
        }}
      >
        Show only unlocked:
        <MultiSelectionBoolean
          setValue={setShowOnlyUnlocked}
          currentValue={showOnlyUnlocked}
        />
      </div>
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
          unlocked={
            (showOnlyUnlocked ? unlockedPerks?.length : data.perks.length) ?? 0
          }
        >
          {data.perks.map((perk) => {
            let iconType: ProgressIconType = 'regular';

            if (
              unlockedPerks &&
              !unlockedPerks.includes(perk.id) &&
              showOnlyUnlocked
            ) {
              iconType = 'unknown';
            } else if (
              currentRun?.worldState?.flags?.newPerkIds?.includes(perk.id)
            ) {
              iconType = 'new';
            }

            return (
              <ActiveIconWrapper
                id={'perk-' + perk.id}
                key={'perk-' + perk.id}
                tooltip={
                  <NoitaPerkTooltip
                    perk={perk}
                    isUnknown={
                      showOnlyUnlocked &&
                      !(!unlockedPerks || unlockedPerks.includes(perk.id))
                    }
                  />
                }
              >
                <ProgressIcon type={iconType} icon={perk.imageBase64} />
              </ActiveIconWrapper>
            );
          })}
        </NoitaProgressIconTable>
        <NoitaProgressIconTable
          count={data.spells.length}
          name={'Spells'}
          columnCount={12}
          unlocked={
            (showOnlyUnlocked ? unlockedSpells?.length : data.spells.length) ??
            0
          }
        >
          {data.spells.map((spell) => {
            let iconType: ProgressIconType = 'regular';

            if (
              unlockedSpells &&
              !unlockedSpells.includes(spell.id) &&
              showOnlyUnlocked
            ) {
              iconType = 'unknown';
            } else if (
              currentRun?.worldState?.flags?.newActionIds?.includes(spell.id)
            ) {
              iconType = 'new';
            }

            return (
              <ActiveIconWrapper
                id={'spell-' + spell.id}
                key={'spell-' + spell.id}
                tooltip={
                  <NoitaSpellTooltip
                    spell={spell}
                    isUnknown={
                      showOnlyUnlocked &&
                      !(!unlockedSpells || unlockedSpells.includes(spell.id))
                    }
                  />
                }
              >
                <ProgressIcon
                  type={iconType}
                  icon={spell.imageBase64}
                  spellBackground={NoitaSpellTypesDictionary[spell.type].image}
                />
              </ActiveIconWrapper>
            );
          })}
        </NoitaProgressIconTable>
        <NoitaProgressIconTable
          count={enemies?.length ?? 0}
          name={'Enemies'}
          columnCount={9}
          unlocked={showOnlyUnlocked ? unlockedEnemycount : enemies?.length}
        >
          {enemies &&
            enemies.map((e) => {
              let iconType: ProgressIconType = 'regular';

              const isEnemyInStatistics =
                enemyStatistics &&
                e.enemyGroup.enemies.some((e) => e.id in enemyStatistics);

              const enemyKilledZeroTimes =
                arrayHelpers.sumBy(
                  Object.values(e.statistics),
                  (stats) => stats.enemyDeathByPlayer,
                ) === 0;

              if (
                showOnlyUnlocked &&
                (!enemyStatistics ||
                  !isEnemyInStatistics ||
                  enemyKilledZeroTimes)
              ) {
                iconType = 'unknown';
              } else if (
                e.enemyGroup.enemies.some((e) =>
                  currentRun?.worldState?.flags?.newEnemyIds?.includes(e.id),
                )
              ) {
                iconType = 'new';
              }

              return (
                <ActiveIconWrapper
                  id={'enemy-' + e.enemyGroup.baseId}
                  key={'enemy-' + e.enemyGroup.baseId}
                  tooltip={
                    <NoitaEnemyGroupTooltip
                      enemyGroup={e.enemyGroup}
                      statistics={e.statistics}
                      isUnknown={
                        showOnlyUnlocked &&
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
                    type={iconType}
                    icon={e.enemyGroup.imageBase64}
                  />
                </ActiveIconWrapper>
              );
            })}
        </NoitaProgressIconTable>
      </div>
    </>
  );
};
