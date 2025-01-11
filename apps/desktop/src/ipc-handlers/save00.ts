import { ipcMain } from 'electron';
import {
  scrapeBonesWands,
  scrapeEnemyStatistics,
  scrapeProgressFlags,
  scrapeSessions,
  noitaPaths,
} from '@noita-explorer/scrapers';
import { getConfig } from '../persistence/config-store';
import path from 'path';
import { FileSystemDirectoryAccessNode } from '../file-system/FileSystemDirectoryAccessNode';

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

    return await scrapeProgressFlags({
      save00DirectoryApi: save00DirectoryApi,
    });
  });
  ipcMain.handle('save00:scrape-enemy-statistics', async () => {
    const save00DirectoryApi = getSave00DirectoryApi();

    return await scrapeEnemyStatistics({
      save00DirectoryApi: save00DirectoryApi,
    });
  });
  ipcMain.handle('save00:scrape-sessions', async () => {
    const save00DirectoryApi = getSave00DirectoryApi();

    return await scrapeSessions({
      save00DirectoryApi: save00DirectoryApi,
    });
  });
  ipcMain.handle('save00:scrape-bones-wands', async () => {
    const save00DirectoryApi = getSave00DirectoryApi();

    return await scrapeBonesWands({
      save00DirectoryApi: save00DirectoryApi,
    });
  });
};
