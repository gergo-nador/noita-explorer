import {
  ActiveIconWrapper,
  Button,
  ProgressIcon,
  ProgressIconType,
} from '@noita-explorer/noita-component-library';
import { useMemo } from 'react';
import { useNoitaDataWakStore } from '../../stores/noita-data-wak.ts';
import { NoitaProgressIconTable } from '../../components/noita-progress-icon-table.tsx';
import { NoitaSpellTooltip } from '../../components/tooltips/noita-spell-tooltip.tsx';
import { NoitaPerkTooltip } from '../../components/tooltips/noita-perk-tooltip.tsx';
import { useSave00Store } from '../../stores/save00.ts';
import { NoitaSpellTypesDictionary } from '../../noita/noita-spell-type-dictionary.ts';
import { NoitaEnemyGroupTooltip } from '../../components/tooltips/noita-enemy-group-tooltip.tsx';
import { useNoitaEnemyGroups } from '../../hooks/use-noita-enemy-groups.ts';
import { arrayHelpers } from '@noita-explorer/tools';
import { MultiSelectionBoolean } from '../../components/multi-selection/multi-selection-boolean.tsx';
import { useQueryParamsBoolean } from '../../hooks/use-query-params-boolean.ts';
import { useNoitaActionsStore } from '../../stores/actions.ts';
import { noitaAPI } from '../../noita-api.ts';
import { Flex } from '../../components/flex.tsx';

export const NoitaProgressTracker = () => {
  const { data } = useNoitaDataWakStore();
  const {
    enemyStatistics,
    unlockedPerks,
    unlockedSpells,
    currentRun,
    status: save00Status,
  } = useSave00Store();
  const { actionUtils } = useNoitaActionsStore();

  const [showAll, setShowAll] = useQueryParamsBoolean('showAll');
  const [__unlockMode, setUnlockMode] = useQueryParamsBoolean('unlockMode');
  const unlockMode = noitaAPI.environment.features.progressUnlockMode
    ? __unlockMode
    : false;

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
      <Flex
        style={{
          marginBottom: 20,
          color: '#ffffffaa',
        }}
      >
        <Flex gap={10}>
          Show all:
          <MultiSelectionBoolean setValue={setShowAll} currentValue={showAll} />
        </Flex>
        {noitaAPI.environment.features.progressUnlockMode && (
          <>
            <HorizontalDivider />
            <div>
              <Button
                decoration={'both'}
                onClick={() => setUnlockMode(!unlockMode)}
              >
                Unlock mode: {unlockMode ? 'on' : 'off'}
              </Button>
            </div>
          </>
        )}
        {unlockMode && (
          <>
            <HorizontalDivider />
            <span>Unlock all:</span>
            <Flex gap={8} style={{ marginLeft: 8 }}>
              <Button
                decoration={'both'}
                onClick={() => {
                  if (save00Status !== 'loaded' || !data) {
                    return;
                  }

                  for (const perk of data.perks) {
                    const isLocked = unlockedPerks
                      ? !unlockedPerks.includes(perk.id)
                      : true;

                    if (isLocked) {
                      actionUtils.perksUnlock.create(perk);
                    }
                  }
                }}
              >
                Perks
              </Button>
              /
              <Button
                decoration={'both'}
                onClick={() => {
                  if (save00Status !== 'loaded' || !data) {
                    return;
                  }

                  for (const spell of data.spells) {
                    const isLocked = unlockedSpells
                      ? !unlockedSpells.includes(spell.id)
                      : true;

                    if (isLocked) {
                      actionUtils.spellUnlock.create(spell);
                    }
                  }
                }}
              >
                Spells
              </Button>
              /
              <Button
                decoration={'both'}
                onClick={() => {
                  if (save00Status !== 'loaded' || !data) {
                    return;
                  }

                  for (const enemy of data.enemies) {
                    const kills =
                      enemyStatistics?.[enemy.id]?.enemyDeathByPlayer;
                    const isLocked = kills === undefined || kills === 0;
                    if (isLocked) {
                      actionUtils.enemyUnlock.create(enemy);
                    }
                  }
                }}
              >
                Enemies
              </Button>
            </Flex>
          </>
        )}

        {!showAll && save00Status !== 'loaded' && (
          <>
            <HorizontalDivider />
            <div style={{ color: 'yellow' }}>Save00 folder not loaded!</div>
          </>
        )}
      </Flex>
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
          unlocked={(showAll ? data.perks.length : unlockedPerks?.length) ?? 0}
        >
          {data.perks.map((perk) => {
            let iconType: ProgressIconType = 'unknown';

            if (currentRun?.worldState?.flags?.newPerkIds?.includes(perk.id)) {
              iconType = 'new';
            } else if (unlockedPerks && unlockedPerks.includes(perk.id)) {
              iconType = 'regular';
            } else if (showAll) {
              iconType = 'regular';
            }

            if (unlockMode) {
              const isUnlockActionPresent = actionUtils.perksUnlock.isOnList(
                perk.id,
              );

              if (iconType === 'new') {
                iconType = 'regular';
              } else if (isUnlockActionPresent) {
                iconType = 'new';
              }
            }

            return (
              <ActiveIconWrapper
                id={'perk-' + perk.id}
                key={'perk-' + perk.id}
                tooltip={
                  unlockMode ? undefined : (
                    <NoitaPerkTooltip
                      perk={perk}
                      isUnknown={iconType === 'unknown'}
                    />
                  )
                }
                onClick={() => {
                  if (!unlockMode || save00Status !== 'loaded') {
                    return;
                  }

                  if (iconType === 'unknown') {
                    actionUtils.perksUnlock.create(perk);
                    return;
                  }

                  const unlockPerkAction = actionUtils.perksUnlock.get(perk.id);
                  if (unlockPerkAction) {
                    actionUtils.removeAction(unlockPerkAction);
                  }
                }}
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
            (showAll ? data.spells.length : unlockedSpells?.length) ?? 0
          }
        >
          {data.spells.map((spell) => {
            let iconType: ProgressIconType = 'unknown';

            if (
              currentRun?.worldState?.flags?.newActionIds?.includes(spell.id)
            ) {
              iconType = 'new';
            } else if (unlockedSpells && unlockedSpells.includes(spell.id)) {
              iconType = 'regular';
            } else if (showAll) {
              iconType = 'regular';
            }

            if (unlockMode) {
              const isUnlockActionPresent = actionUtils.spellUnlock.isOnList(
                spell.id,
              );

              if (iconType === 'new') {
                iconType = 'regular';
              } else if (isUnlockActionPresent) {
                iconType = 'new';
              }
            }

            return (
              <ActiveIconWrapper
                id={'spell-' + spell.id}
                key={'spell-' + spell.id}
                tooltip={
                  unlockMode ? undefined : (
                    <NoitaSpellTooltip
                      spell={spell}
                      isUnknown={iconType === 'unknown'}
                    />
                  )
                }
                onClick={() => {
                  if (!unlockMode || save00Status !== 'loaded') {
                    return;
                  }

                  if (iconType === 'unknown') {
                    actionUtils.spellUnlock.create(spell);
                    return;
                  }

                  const unlockSpellAction = actionUtils.spellUnlock.get(
                    spell.id,
                  );
                  if (unlockSpellAction) {
                    actionUtils.removeAction(unlockSpellAction);
                  }
                }}
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
          unlocked={!showAll ? unlockedEnemycount : enemies?.length}
        >
          {enemies &&
            enemies.map((e) => {
              let iconType: ProgressIconType = 'unknown';

              const isEnemyInStatistics =
                enemyStatistics &&
                e.enemyGroup.enemies.some((e) => e.id in enemyStatistics);

              const enemyKilledZeroTimes =
                arrayHelpers.sumBy(
                  Object.values(e.statistics),
                  (stats) => stats.enemyDeathByPlayer,
                ) === 0;

              const showEnemy = !(
                !enemyStatistics ||
                !isEnemyInStatistics ||
                enemyKilledZeroTimes
              );

              if (
                e.enemyGroup.enemies.some((e) =>
                  currentRun?.worldState?.flags?.newEnemyIds?.includes(e.id),
                )
              ) {
                iconType = 'new';
              } else if (showEnemy) {
                iconType = 'regular';
              } else if (showAll) {
                iconType = 'regular';
              }

              if (unlockMode) {
                const isUnlockActionPresent = e.enemyGroup.enemies.some(
                  (enemy) => actionUtils.enemyUnlock.isOnList(enemy.id),
                );

                if (iconType === 'new') {
                  iconType = 'regular';
                } else if (isUnlockActionPresent) {
                  iconType = 'new';
                }
              }

              return (
                <ActiveIconWrapper
                  id={'enemy-' + e.enemyGroup.baseId}
                  key={'enemy-' + e.enemyGroup.baseId}
                  tooltip={
                    unlockMode ? undefined : (
                      <NoitaEnemyGroupTooltip
                        enemyGroup={e.enemyGroup}
                        statistics={e.statistics}
                        isUnknown={iconType === 'unknown'}
                      />
                    )
                  }
                  onClick={() => {
                    if (!unlockMode || save00Status !== 'loaded') {
                      return;
                    }

                    if (iconType === 'unknown') {
                      e.enemyGroup.enemies.forEach((enemy) =>
                        actionUtils.enemyUnlock.create(enemy),
                      );

                      return;
                    }

                    e.enemyGroup.enemies.forEach((enemy) => {
                      const unlockEnemyAction = actionUtils.enemyUnlock.get(
                        enemy.id,
                      );

                      if (unlockEnemyAction) {
                        actionUtils.removeAction(unlockEnemyAction);
                      }
                    });
                  }}
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

const HorizontalDivider = () => (
  <div
    style={{
      height: '1rem',
      width: 2,
      color: 'inherit',
      background: 'currentcolor',
      marginLeft: 30,
      marginRight: 30,
    }}
  />
);
