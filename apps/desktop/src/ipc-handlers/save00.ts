import { ipcMain } from 'electron';
import { scrape, noitaPaths } from '@noita-explorer/scrapers';
import { getConfig } from '../persistence/config-store';
import path from 'path';
import { FileSystemDirectoryAccessNode } from '@noita-explorer/file-systems';

export const registerSave00Handlers = () => {
  const getSave00DirectoryApi = () => {
    const nollaGamesNoita = getConfig(
      'settings.paths.NollaGamesNoita',
    ) as string;

    const save00Folder = path.join(
      nollaGamesNoita,
      ...noitaPaths.save00.folder,
    );

    return FileSystemDirectoryAccessNode(save00Folder);
  };

  ipcMain.handle('save00:scrape-progress-flags', async () => {
    const save00DirectoryApi = getSave00DirectoryApi();

    return await scrape.progressFlags({
      save00DirectoryApi: save00DirectoryApi,
    });
  });
  ipcMain.handle('save00:scrape-enemy-statistics', async () => {
    const save00DirectoryApi = getSave00DirectoryApi();

    return await scrape.enemyStatistics({
      save00DirectoryApi: save00DirectoryApi,
    });
  });
  ipcMain.handle('save00:scrape-sessions', async () => {
    const save00DirectoryApi = getSave00DirectoryApi();

    return await scrape.sessions({
      save00DirectoryApi: save00DirectoryApi,
    });
  });
  ipcMain.handle('save00:scrape-bones-wands', async () => {
    const save00DirectoryApi = getSave00DirectoryApi();

    return await scrape.bonesWands({
      save00DirectoryApi: save00DirectoryApi,
    });
  });
  ipcMain.handle('save00:scrape-world-state', async () => {
    const save00DirectoryApi = getSave00DirectoryApi();

    return await scrape.worldState({
      save00DirectoryApi: save00DirectoryApi,
    });
  });
};
