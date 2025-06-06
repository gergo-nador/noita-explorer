import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { noitaPaths } from '../../../noita-paths.ts';
import { constants } from '../../../constants.ts';
import { UnlockPerkAction } from '@noita-explorer/model-noita';

export const unlockPerk = async ({
  save00DirectoryApi,
  action,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
  action: UnlockPerkAction;
}) => {
  const perkId = action.payload.perkId;
  const flagsDirPath = await save00DirectoryApi.path.join(
    noitaPaths.save00.flags,
  );
  const flagsDir = await save00DirectoryApi.getDirectory(flagsDirPath);

  const perkProgressFlagFileName = 'perk_picked_' + perkId.toLowerCase();

  const file = await flagsDir.createFile(perkProgressFlagFileName);
  await file.modify.fromText(constants.whyAreYouLookingHere);
};
