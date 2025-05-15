import { noitaAPI } from '../../ipcHandlers.ts';
import { Button, useToast } from '@noita-explorer/noita-component-library';
import { useNoitaActionsStore } from '../../stores/actions.ts';
import { useSave00Store } from '../../stores/save00.ts';

export const ActionsRunAllButton = ({ onClick }: { onClick: () => void }) => {
  const { actions, actionUtils } = useNoitaActionsStore();
  const { modify: modifySave00 } = useSave00Store();
  const toast = useToast();

  const runActions = async () => {
    const array = Object.values(actions);
    noitaAPI.noita.actions.runActions(array).then((results) => {
      // make modifications to the save00 stores from the successful actions
      modifySave00((prev) => {
        const bonesWands = prev.bonesWands ? [...prev.bonesWands] : undefined;
        const unlockedPerks =
          prev.unlockedPerks !== undefined
            ? [...prev.unlockedPerks]
            : undefined;

        for (const result of results) {
          if (result.type !== 'success') {
            continue;
          }

          const action = result.action;
          if (action.type === 'bones-wand-delete') {
            const index = bonesWands?.findIndex(
              (bones) => bones.fileName === action.payload.bonesFileName,
            );
            if (index !== undefined && index > -1) {
              bonesWands?.splice(index, 1);
            }
          } else if (action.type === 'unlock-perk') {
            const isPerkAlreadyUnlocked = unlockedPerks?.includes(
              action.payload.perkId,
            );

            if (!isPerkAlreadyUnlocked) {
              unlockedPerks?.push(action.payload.perkId);
            }
          }
        }

        return {
          ...prev,
          bonesWands: bonesWands,
          unlockedPerks: unlockedPerks,
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
    });
  };

  return (
    <Button decoration={'both'} onClick={runActions}>
      Run Actions
    </Button>
  );
};
