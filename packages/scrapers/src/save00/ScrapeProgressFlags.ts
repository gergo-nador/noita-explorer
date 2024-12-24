import {
  FileSystemFolderBrowserApi,
  noitaPaths,
  NoitaProgressFlags,
} from '@noita-explorer/model';

export const scrapeProgressFlags = async ({
  save00BrowserApi,
}: {
  save00BrowserApi: FileSystemFolderBrowserApi;
}): Promise<NoitaProgressFlags> => {
  const flagsFolderPath = await save00BrowserApi.path.join(
    noitaPaths.save00.flags,
  );
  const flagsFolder = await save00BrowserApi.getFolder(flagsFolderPath);
  const files = await flagsFolder.listFilesFromFolder();

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
