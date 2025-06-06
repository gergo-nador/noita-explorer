import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { UnlockFlagAction } from '@noita-explorer/model-noita';
import { createFlagUtil } from './utils.ts';

export const createFlag = ({
  save00DirectoryApi,
  action,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
  action: UnlockFlagAction;
}) => {
  return createFlagUtil({ save00DirectoryApi, flag: action.payload.flag });
};
