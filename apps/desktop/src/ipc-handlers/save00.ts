import { ipcMain } from 'electron';
import {
  scrapeEnemyStatistics,
  scrapeProgressFlags,
  scrapeSessions,
} from '@noita-explorer/scrapers';
import { getConfig } from '../persistence/config-store';
import path from 'path';
import { noitaPaths } from '@noita-explorer/model';
import { FileSystemDirectoryAccessNode } from '../file-system/FileSystemDirectoryAccessNode';

export const registerSave00Handlers = () => {
  ipcMain.handle('save00:scrape-progress-flags', async () => {
    const nollaGamesNoita = getConfig(
      'settings.paths.NollaGamesNoita',
    ) as string;

    const save00Folder = path.join(
      nollaGamesNoita,
      ...noitaPaths.save00.folder,
    );

    const save00DirectoryApi = FileSystemDirectoryAccessNode(save00Folder);

    return await scrapeProgressFlags({
      save00DirectoryApi: save00DirectoryApi,
    });
  });
  ipcMain.handle('save00:scrape-enemy-statistics', async () => {
    const nollaGamesNoita = getConfig(
      'settings.paths.NollaGamesNoita',
    ) as string;

    const save00Folder = path.join(
      nollaGamesNoita,
      ...noitaPaths.save00.folder,
    );

    const save00DirectoryApi = FileSystemDirectoryAccessNode(save00Folder);

    return await scrapeEnemyStatistics({
      save00DirectoryApi: save00DirectoryApi,
    });
  });
  ipcMain.handle('save00:scrape-sessions', async () => {
    const nollaGamesNoita = getConfig(
      'settings.paths.NollaGamesNoita',
    ) as string;

    const save00Folder = path.join(
      nollaGamesNoita,
      ...noitaPaths.save00.folder,
    );

    const save00DirectoryApi = FileSystemDirectoryAccessNode(save00Folder);

    return await scrapeSessions({
      save00DirectoryApi: save00DirectoryApi,
    });
  });
};
