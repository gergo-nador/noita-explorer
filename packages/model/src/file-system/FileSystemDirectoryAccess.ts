import { FileSystemFileAccess } from './FileSystemFileAccess.ts';

export interface FileSystemDirectoryAccess {
  getName: () => string;
  getFullPath: () => string;
  checkRelativePathExists: (path: string) => Promise<boolean>;
  getFile: (path: string) => Promise<FileSystemFileAccess>;
  getDirectory: (path: string) => Promise<FileSystemDirectoryAccess>;
  listFiles: () => Promise<FileSystemFileAccess[]>;
  listDirectories: () => Promise<FileSystemDirectoryAccess[]>;

  path: {
    join: (args: string[]) => Promise<string>;
    split: (path: string) => Promise<string[]>;
  };
}
