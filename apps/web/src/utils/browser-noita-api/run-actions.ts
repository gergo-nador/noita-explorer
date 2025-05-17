import {
  NoitaAction,
  NoitaActionProgress,
  NoitaActionResult,
} from '@noita-explorer/model-noita';
import { actions } from '@noita-explorer/scrapers';
import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { Dispatch } from 'react';

export const runActions = async ({
  noitaActions,
  save00FolderHandle,
  callback,
}: {
  noitaActions: NoitaAction[];
  save00FolderHandle: FileSystemDirectoryAccess;
  callback: Dispatch<NoitaActionProgress>;
}): Promise<NoitaActionResult[]> => {
  const success: NoitaActionResult[] = [];
  const error: NoitaActionResult[] = [];

  for (const action of noitaActions) {
    try {
      if (action.type === 'bones-wand-delete') {
        await actions.deleteBonesWands({
          save00DirectoryApi: save00FolderHandle,
          bonesWandFileName: action.payload.bonesFileName,
        });
      } else if (action.type === 'unlock-perk') {
        await actions.unlockPerk({
          save00DirectoryApi: save00FolderHandle,
          perkId: action.payload.perkId,
        });
      } else if (action.type === 'unlock-spell') {
        await actions.unlockSpell({
          save00DirectoryApi: save00FolderHandle,
          spellId: action.payload.spellId,
        });
      } else if (action.type === 'unlock-enemy') {
        throw new Error('not implemented in run-actions.ts');
      } else {
        console.error(
          action,
          'not implemented in "actions-run-all-button.tsx"',
        );
      }

      success.push({ type: 'success', action: action });
    } catch (e) {
      error.push({ type: 'error', action: action, error: e as Error });
    }

    try {
      callback({
        all: noitaActions.length,
        success: success.length,
        failed: error.length,
      });
    } catch (err) {
      console.error('Error in callback for running actions: ', err);
    }
  }

  return [...success, ...error];
};
