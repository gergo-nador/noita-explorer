import { FileSystemFileAccess } from './FileSystemFileAccess.ts';

export interface FileSystemDirectoryAccess {
  getName: () => string;
  checkRelativePathExists: (path: string) => Promise<boolean>;
  getFile: (path: string) => Promise<FileSystemFileAccess>;
  getDirectory: (path: string) => Promise<FileSystemDirectoryAccess>;
  listFilesFromDirectory: () => Promise<FileSystemFileAccess[]>;

  path: {
    join: (args: string[]) => Promise<string>;
  };
}
