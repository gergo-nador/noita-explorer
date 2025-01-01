import {
  FileSystemDirectoryAccess,
  noitaPaths,
  NoitaProgressFlags,
} from '@noita-explorer/model';

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

  const actionFlags = files
    .map((f) => f.getNameWithoutExtension())
    .filter((f) => f.startsWith('action_'))
    .map((f) => f.substring('action_'.length))
    .map((s) => s.toUpperCase());

  const perkFlags = files
    .map((f) => f.getNameWithoutExtension())
    .filter((f) => f.startsWith('perk_picked_'))
    .map((f) => f.substring('perk_picked_'.length))
    .map((s) => s.toUpperCase());

  return {
    spells: actionFlags,
    perks: perkFlags,
  };
};
