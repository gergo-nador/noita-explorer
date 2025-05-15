import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { noitaPaths } from '../../../noita-paths.ts';
import { constants } from '../../../constants.ts';

export const unlockPerk = async ({
  save00DirectoryApi,
  perkId,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
  perkId: string;
}) => {
  const flagsDirPath = await save00DirectoryApi.path.join(
    noitaPaths.save00.flags,
  );
  const flagsDir = await save00DirectoryApi.getDirectory(flagsDirPath);

  const perkProgressFlagFileName = 'perk_picked_' + perkId.toLowerCase();

  const file = await flagsDir.createFile(perkProgressFlagFileName);
  await file.modify.asText(constants.whyAreYouLookingHere);
};
