import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { NoitaProgressFlags } from '@noita-explorer/model-noita';
import { noitaPaths } from '../../../../noita-paths.ts';

export const scrapeProgressFlags = async ({
  save00DirectoryApi,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
}): Promise<NoitaProgressFlags> => {
  const flagsDirPath = await save00DirectoryApi.path.join(
    noitaPaths.save00.flags,
  );
  const flagsDir = await save00DirectoryApi.getDirectory(flagsDirPath);
  const files = await flagsDir.listFiles();

  const fileNamesWithoutExtension = files.map((f) =>
    f.getNameWithoutExtension(),
  );

  const actionFlags = fileNamesWithoutExtension
    .filter((f) => f.startsWith('action_'))
    .map((f) => f.substring('action_'.length));

  const perkFlags = fileNamesWithoutExtension
    .filter((f) => f.startsWith('perk_picked_'))
    .map((f) => f.substring('perk_picked_'.length));

  return {
    spells: actionFlags,
    perks: perkFlags,
    all: fileNamesWithoutExtension,
  };
};
