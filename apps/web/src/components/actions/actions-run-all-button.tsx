import { noitaAPI } from '../../ipcHandlers.ts';
import { Button, useToast } from '@noita-explorer/noita-component-library';
import { useNoitaActionsStore } from '../../stores/actions.ts';
import { useSave00Store } from '../../stores/save00.ts';
import { useState } from 'react';
import { NoitaActionProgress } from '@noita-explorer/model-noita';

export const ActionsRunAllButton = ({ onClick }: { onClick: () => void }) => {
  const { actions, actionUtils } = useNoitaActionsStore();
  const { modify: modifySave00 } = useSave00Store();
  const toast = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<NoitaActionProgress>();

  const runActions = async () => {
    setIsRunning(true);

    const updateCallback = (progress: NoitaActionProgress) =>
      setProgress(progress);

    const array = Object.values(actions);
    noitaAPI.noita.actions
      .runActions(array, updateCallback)
      .then((results) => {
        // make modifications to the save00 stores from the successful actions
        modifySave00((prev) => {
          const bonesWands = shallowCopyArray(prev.bonesWands);
          const unlockedPerks = shallowCopyArray(prev.unlockedPerks);
          const unlockedSpells = shallowCopyArray(prev.unlockedSpells);
          const enemyStatistics = shallowCopyObject(prev.enemyStatistics);

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
          }

          return {
            ...prev,
            bonesWands: bonesWands,
            unlockedPerks: unlockedPerks,
            unlockedSpells: unlockedSpells,
          };
        });

        // remove all succeeded actions from tracking
        for (const result of results) {
          if (result.type === 'success') {
            actionUtils.removeAction(result.action);
          }
        }

        const numberOfSuccess = results.reduce(
          (success, current) => success + (current.type === 'success' ? 1 : 0),
          0,
        );

        if (numberOfSuccess > 0) {
          const message =
            numberOfSuccess === 1
              ? '1 action has been completed!'
              : `${numberOfSuccess} actions have been completed!`;

          toast.success(message);
        }

        const numberOfErrors = results.reduce(
          (errors, current) => errors + (current.type === 'error' ? 1 : 0),
          0,
        );

        if (numberOfErrors > 0) {
          const message =
            numberOfErrors === 1
              ? '1 action has failed :('
              : `${numberOfErrors} actions have failed :(`;

          toast.error(message);
        }

        onClick();
      })
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

  const progressNumber = (progress?.success ?? 0) + (progress?.failed ?? 0);

  return (
    <Button disabled={isRunning} decoration={'both'} onClick={runActions}>
      {isRunning && (
        <span>
          Running... ({progressNumber} / {progress?.all})
        </span>
      )}
      {!isRunning && <span>Run Actions</span>}
    </Button>
  );
};

const shallowCopyArray = <T,>(arr: T[] | undefined) => {
  if (!arr) {
    return undefined;
  }

  return [...arr];
};

const shallowCopyObject = <T extends object>(obj: T | undefined) => {
  if (!obj) {
    return undefined;
  }

  return { ...obj };
};
