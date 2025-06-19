import {
  NoitaAction,
  NoitaActionProgress,
  NoitaActionResult,
} from '@noita-explorer/model-noita';
import { actions } from '@noita-explorer/scrapers';
import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { Dispatch } from 'react';
import { sentry } from '../sentry.ts';

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
      const type = action.type;
      if (type === 'bones-wand-delete') {
        await actions.deleteBonesWands({
          save00DirectoryApi: save00FolderHandle,
          action: action,
        });
      } else if (type === 'unlock-perk') {
        await actions.unlockPerk({
          save00DirectoryApi: save00FolderHandle,
          action: action,
        });
      } else if (type === 'unlock-spell') {
        await actions.unlockSpell({
          save00DirectoryApi: save00FolderHandle,
          action: action,
        });
      } else if (type === 'unlock-enemy') {
        await actions.unlockEnemy({
          save00DirectoryApi: save00FolderHandle,
          action: action,
        });
      } else if (type === 'unlock-decoration') {
        await actions.unlockDecoration({
          save00DirectoryApi: save00FolderHandle,
          action: action,
        });
      } else if (type === 'unlock-flag') {
        await actions.unlockFlag({
          save00DirectoryApi: save00FolderHandle,
          action: action,
        });
      } else {
        sentry.captureError(
          `Action type ${type} was not run as it is not implemented`,
        );
      }

      success.push({ type: 'success', action: action });
    } catch (e) {
      error.push({ type: 'error', action: action, error: e as Error });
      console.error(e);
      sentry.captureError(e);
    }

    try {
      callback({
        all: noitaActions.length,
        success: success.length,
        failed: error.length,
      });
    } catch (err) {
      sentry.captureError(err);
    }
  }

  return [...success, ...error];
};
