import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { noitaPaths } from '../../../noita-paths.ts';
import { constants } from '../../../constants.ts';

export const unlockSpell = async ({
  save00DirectoryApi,
  spellId,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
  spellId: string;
}) => {
  const flagsDirPath = await save00DirectoryApi.path.join(
    noitaPaths.save00.flags,
  );
  const flagsDir = await save00DirectoryApi.getDirectory(flagsDirPath);

  const spellProgressFlagFileName = 'action_' + spellId.toLowerCase();

  const file = await flagsDir.createFile(spellProgressFlagFileName);
  await file.modify.fromText(constants.whyAreYouLookingHere);
};
