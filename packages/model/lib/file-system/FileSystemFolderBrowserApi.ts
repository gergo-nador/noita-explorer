import { FileSystemFile } from './FileSystemFile';

export interface FileSystemFolderBrowserApi {
  checkRelativePathExists: (path: string) => Promise<boolean>;
  getFile: (path: string) => Promise<FileSystemFile>;
  getFolder: (path: string) => Promise<FileSystemFolderBrowserApi>;
  listFilesFromFolder: () => Promise<FileSystemFile[]>;
}
