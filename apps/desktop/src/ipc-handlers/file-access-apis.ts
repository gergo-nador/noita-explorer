import { ipcMain } from 'electron';
import {
  FileSystemFile,
  FileSystemFolderBrowserApi,
  noitaPaths,
} from '@noita-explorer/model';
import { FileSystemFolderBrowserNode } from '../file-system-api/FileSystemFolderBrowserNode';
import { getConfig } from '../persistence/config-store';
import { checkPathExist } from '../utils/file-system';
import path from 'path';
import { FileSystemFileNode } from '../file-system-api/FileSystemFileNode';

export const registerFileAccessHandlers = () => {
  ipcMain.handle(
    'noita-file-access:translations',
    async (): Promise<FileSystemFile> => {
      const installPath = getConfig('settings.paths.install') as string;

      const commonCsvPath = path.join(
        installPath,
        ...noitaPaths.noitaInstallFolder.translation,
      );

      if (!checkPathExist(commonCsvPath)) {
        throw new Error(
          'Could not find common.csv at location ' + commonCsvPath,
        );
      }

      return FileSystemFileNode(commonCsvPath);
    },
  );
  ipcMain.handle(
    'noita-file-access:data-wak-extracted',
    async (): Promise<FileSystemFolderBrowserApi> => {
      // provide thee NollaGamesNoita folder instead of the actual data folder as
      // the code expects the directory above the extracted data wak folder
      const nollaGamesNoita = getConfig(
        'settings.paths.NollaGamesNoita',
      ) as string;

      const dataFolder = path.join(
        nollaGamesNoita,
        ...noitaPaths.noitaDataWak.folder,
      );
      if (!checkPathExist(dataFolder)) {
        throw new Error('Extracted data path does not exist');
      }

      return FileSystemFolderBrowserNode(nollaGamesNoita);
    },
  );
};
