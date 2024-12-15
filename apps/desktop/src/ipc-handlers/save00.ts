import { ipcMain } from 'electron';
import {
  scrapeEnemyStatistics,
  scrapeProgressFlags,
} from '@noita-explorer/scrapers';
import { getConfig } from '../persistence/config-store';
import path from 'path';
import { noitaPaths } from '@noita-explorer/model';
import { FileSystemFolderBrowserNode } from '../file-system-api/FileSystemFolderBrowserNode';

export const registerSave00Handlers = () => {
  ipcMain.handle('save00:scrape-progress-flags', async () => {
    const nollaGamesNoita = getConfig(
      'settings.paths.NollaGamesNoita',
    ) as string;

    const save00Folder = path.join(
      nollaGamesNoita,
      ...noitaPaths.save00.folder,
    );

    const save00FolderBrowserApi = FileSystemFolderBrowserNode(save00Folder);

    return await scrapeProgressFlags({
      save00BrowserApi: save00FolderBrowserApi,
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

    const save00FolderBrowserApi = FileSystemFolderBrowserNode(save00Folder);

    return await scrapeEnemyStatistics({
      save00BrowserApi: save00FolderBrowserApi,
    });
  });
};
