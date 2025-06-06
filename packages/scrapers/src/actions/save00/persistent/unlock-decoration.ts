import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { UnlockDecorationAction } from '@noita-explorer/model-noita';

export const unlockDecoration = async ({
  save00DirectoryApi,
  action,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
  action: UnlockDecorationAction;
}) => {
  throw new Error("this didn't work");
  console.log(action, save00DirectoryApi);
};
