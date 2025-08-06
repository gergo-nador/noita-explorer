import { noitaAPI } from '../utils/noita-api.ts';
import { Dispatch, useState } from 'react';
import { useToast } from '@noita-explorer/noita-component-library';
import { useNoitaActionsStore } from '../stores/actions.ts';
import { useSave00Store } from '../stores/save00.ts';
import {
  NoitaActionProgress,
  NoitaActionResult,
} from '@noita-explorer/model-noita';
import { StringKeyDictionary } from '@noita-explorer/model';
import { arrayHelpers } from '@noita-explorer/tools';
import { sentry } from '../utils/sentry.ts';

export const useRunActions = ({
  successCallback,
}: {
  successCallback: Dispatch<void>;
}) => {
  const { actions, actionUtils } = useNoitaActionsStore();
  const { modify: modifySave00 } = useSave00Store();
  const [progress, setProgress] = useState<NoitaActionProgress>();
  const [runActionWarning, setRunActionWarning] = useState({
    accepted: false,
    display: false,
  });
  const [isRunning, setIsRunning] = useState(false);
  const toast = useToast();
  const [lastRunFailedActions, setLastRunFailedActions] = useState<
    StringKeyDictionary<NoitaActionResult>
  >({});

  const runActions = async () => {
    if (isRunning) {
      return;
    }

    // first check if the warning should be displayed to the users
    const numberOfRuns = await noitaAPI.noita.actions.getNumberOfActionsRan();
    const runActionsWarningNeeded = numberOfRuns === 0;

    if (runActionsWarningNeeded && !runActionWarning.accepted) {
      setRunActionWarning({
        ...runActionWarning,
        display: true,
      });

      return;
    }

    // if no warning, run the actions
    setIsRunning(true);

    const array = Object.values(actions);
    return noitaAPI.noita.actions
      .runActions(array, setProgress)
      .then(
        (results) => {
          // make modifications to the save00 stores from the successful actions
          modifySave00((prev) => {
            const bonesWands = shallowCopyArray(prev.bonesWands);
            const unlockedPerks = shallowCopyArray(prev.unlockedPerks);
            const unlockedSpells = shallowCopyArray(prev.unlockedSpells);
            const enemyStatistics = shallowCopyObject(prev.enemyStatistics, {});
            const flags = prev.flags
              ? new Set(setGetAllKeys(prev.flags))
              : new Set<string>();

            for (const result of results) {
              if (result.type !== 'success') {
                continue;
              }

              const action = result.action;
              if (action.type === 'bones-wand-delete' && bonesWands) {
                const index = bonesWands.findIndex(
                  (bones) => bones.fileName === action.payload.bonesFileName,
                );
                if (index !== undefined && index > -1) {
                  bonesWands.splice(index, 1);
                }
              }
              if (action.type === 'unlock-perk' && unlockedPerks) {
                const isPerkAlreadyUnlocked = unlockedPerks.includes(
                  action.payload.perkId,
                );

                if (!isPerkAlreadyUnlocked) {
                  unlockedPerks.push(action.payload.perkId);
                }
              }
              if (action.type === 'unlock-spell' && unlockedSpells) {
                const isSpellAlreadyUnlocked = unlockedSpells.includes(
                  action.payload.spellId,
                );

                if (!isSpellAlreadyUnlocked) {
                  unlockedSpells.push(action.payload.spellId);
                }
              }
              if (action.type === 'unlock-enemy' && enemyStatistics) {
                if (!(action.payload.enemyId in enemyStatistics)) {
                  enemyStatistics[action.payload.enemyId] = {
                    id: action.payload.enemyId,
                    enemyDeathByPlayer: action.payload.numberOfTimesEnemyKilled,
                    playerDeathByEnemy: 0,
                  };
                }

                enemyStatistics[action.payload.enemyId].enemyDeathByPlayer =
                  action.payload.numberOfTimesEnemyKilled;
              }
              if (action.type === 'unlock-decoration' && flags) {
                if (
                  action.payload.permanent &&
                  !flags.has(action.payload.decoration)
                ) {
                  flags.add(action.payload.decoration);
                }

                if (prev.currentRun) {
                  const decorations = prev.currentRun.playerState.decorations;
                  if (action.payload.decoration === 'secret_hat') {
                    decorations.player_hat2 ??= { enabled: true };
                    decorations.player_hat2.enabled = true;
                  } else if (action.payload.decoration === 'secret_amulet') {
                    decorations.player_amulet ??= { enabled: true };
                    decorations.player_amulet.enabled = true;
                  } else if (
                    action.payload.decoration === 'secret_amulet_gem'
                  ) {
                    decorations.player_amulet_gem ??= { enabled: true };
                    decorations.player_amulet_gem.enabled = true;
                  } else {
                    sentry.captureError(
                      `Handling decoration ${action.payload.decoration} not implemented for action ${action.type}.`,
                    );
                  }
                }
              }
              if (action.type === 'unlock-flag') {
                flags.add(action.payload.flag);
              }
            }

            return {
              ...prev,
              bonesWands: bonesWands,
              unlockedPerks: unlockedPerks,
              unlockedSpells: unlockedSpells,
              enemyStatistics: enemyStatistics,
              flags: flags,
            };
          });

          // remove all succeeded actions from tracking
          for (const result of results) {
            if (result.type === 'success') {
              actionUtils.removeAction(result.action);
            }
          }

          const numberOfSuccess = results.reduce(
            (success, current) =>
              success + (current.type === 'success' ? 1 : 0),
            0,
          );

          if (numberOfSuccess > 0) {
            const message =
              numberOfSuccess === 1
                ? '1 action has been completed!'
                : `${numberOfSuccess} actions have been completed!`;

            toast.success(message);
          }

          const failedActions = results.filter(
            (result) => result.type === 'error',
          );
          const numberOfErrors = failedActions.length;

          if (numberOfErrors > 0) {
            const message =
              numberOfErrors === 1
                ? '1 action has failed :('
                : `${numberOfErrors} actions have failed :(`;

            toast.error(message);

            const failedActionDict = arrayHelpers.asDict(
              failedActions,
              (a) => a.action.id,
            );
            setLastRunFailedActions(failedActionDict);
          } else {
            setLastRunFailedActions({});
            successCallback();
          }
        },
        (err) => {
          toast.error('Failed to run actions: ' + err);
        },
      )
      .then(() => {
        setIsRunning(false);
        setProgress(undefined);
      })
      .catch((err) => {
        console.error(
          'error while executing the actions (actions-run-all-button.tsx)',
          err,
        );

        setIsRunning(false);
        setProgress(undefined);
      });
  };

  return {
    runActions,
    progress,
    isRunning,
    runActionWarning,
    lastRunFailedActions,
    acceptWarning: () =>
      setRunActionWarning({
        ...runActionWarning,
        accepted: true,
        display: false,
      }),
  };
};

const shallowCopyArray = <T>(arr: T[] | undefined) => {
  if (!arr) {
    return [];
  }

  return [...arr];
};

const shallowCopyObject = <T extends object>(
  obj: T | undefined,
  defaultValue: T,
): T => {
  if (!obj) {
    return defaultValue;
  }

  return { ...obj };
};

const setGetAllKeys = <T>(set: Set<T>) => {
  const keys = set.keys();
  const arr: T[] = [];

  let next = keys.next();
  while (!next.done) {
    arr.push(next.value);
    next = keys.next();
  }

  return arr;
};
