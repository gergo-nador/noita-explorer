import { noitaAPI } from '../../ipcHandlers.ts';
import { Button } from '@noita-explorer/noita-component-library';
import { useNoitaActionsStore } from '../../stores/actions.ts';
import { useSave00Store } from '../../stores/save00.ts';

export const ActionsRunAllButton = () => {
  const { actions, actionUtils } = useNoitaActionsStore();
  const { modify } = useSave00Store();

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
    });
  };

  return (
    <Button decoration={'both'} onClick={runActions}>
      Run Actions
    </Button>
  );
};
