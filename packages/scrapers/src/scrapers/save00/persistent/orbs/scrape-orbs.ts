import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { noitaPaths } from '../../../../noita-paths.ts';

export const scrapeUnlockedOrbs = async ({
  save00DirectoryApi,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
}): Promise<string[]> => {
  const orbsFolderPath = await save00DirectoryApi.path.join(
    noitaPaths.save00.orbs_new,
  );

  const orbsFolder = await save00DirectoryApi.getDirectory(orbsFolderPath);
  const files = await orbsFolder.listFiles();
  const orbFiles = files
    .filter((file) => {
      const fileName = file.getName();
      const number = parseInt(fileName);

      /*
    Orbs are named as the following:
    - main world: 0 - 11
    - west parallel world: 128 - 138
    - east parallel world: 256 - 266
     */

      return !isNaN(number);
    })
    .map((file) => file.getName());

  orbFiles.sort((a, b) => parseInt(a) - parseInt(b));

  return orbFiles;
};
