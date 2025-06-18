import { NoitaAction } from './noita-action.ts';

export type NoitaActionResult =
  | NoitaActionSuccessResult
  | NoitaActionErrorResult;

interface NoitaActionSuccessResult {
  type: 'success';
  action: NoitaAction;
}

interface NoitaActionErrorResult {
  type: 'error';
  action: NoitaAction;
  error: Error;
}
