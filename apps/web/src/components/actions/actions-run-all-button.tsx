import { noitaAPI } from '../../ipcHandlers.ts';
import { Button, useToast } from '@noita-explorer/noita-component-library';
import { useNoitaActionsStore } from '../../stores/actions.ts';
import { useSave00Store } from '../../stores/save00.ts';

export const ActionsRunAllButton = ({ onClick }: { onClick: () => void }) => {
  const { actions, actionUtils } = useNoitaActionsStore();
  const { modify } = useSave00Store();
  const toast = useToast();

  const runActions = async () => {
    const array = Object.values(actions);
    noitaAPI.noita.actions.runActions(array).then((results) => {
      modify((prev) => {
        const bonesWands = prev.bonesWands;

        for (const result of results) {
          if (result.type !== 'success') {
            continue;
          }

          actionUtils.removeAction(result.action);

          if (result.action.type === 'bones-wand-delete') {
            const index = bonesWands?.findIndex(
              (bones) => bones.fileName === result.action.payload.bonesFileName,
            );
            if (index !== undefined && index > -1) {
              bonesWands?.splice(index, 1);
            }
          }
        }

        return {
          ...prev,
          bonesWands: bonesWands !== undefined ? [...bonesWands] : undefined,
        };
      });

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
