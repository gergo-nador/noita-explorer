import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { noitaPaths } from '../../../noita-paths.ts';
import { constants } from '../../../constants.ts';

export const createFlag = async ({
  save00DirectoryApi,
  flag,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
  flag: string;
}) => {
  const flagsDirPath = await save00DirectoryApi.path.join(
    noitaPaths.save00.flags,
  );
  const flagsDir = await save00DirectoryApi.getDirectory(flagsDirPath);

  let file: FileSystemFileAccess;
  try {
    file = await flagsDir.createFile(flag);
  } catch (ex) {
    // @ts-expect-error message exists in exception
    throw new Error(`Failed to create a file ${flag}: ` + ex?.message);
  }

  await file.modify.fromText(constants.whyAreYouLookingHere);
};
