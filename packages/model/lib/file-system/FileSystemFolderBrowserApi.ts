import { FileSystemFile } from './FileSystemFile';

export interface FileSystemFolderBrowserApi {
  getName: () => string;
  checkRelativePathExists: (path: string) => Promise<boolean>;
  getFile: (path: string) => Promise<FileSystemFile>;
  getFolder: (path: string) => Promise<FileSystemFolderBrowserApi>;
  listFilesFromFolder: () => Promise<FileSystemFile[]>;

  path: {
    join: (args: string[]) => Promise<string>;
  };
}
