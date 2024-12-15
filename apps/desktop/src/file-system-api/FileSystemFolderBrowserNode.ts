import { FileSystemFolderBrowserApi } from '@noita-explorer/model';
import { checkPathExist, getPathsFromFolder } from '../utils/file-system';
import path from 'path';
import fs from 'fs';
import { FileSystemFileNode } from './FileSystemFileNode';
import { resolvePromise } from '@noita-explorer/tools';

export const FileSystemFolderBrowserNode = (
  folderPath: string,
): FileSystemFolderBrowserApi => {
  if (!checkPathExist(folderPath)) {
    throw new Error(`folder path '${folderPath}' does not exist`);
  }

  const checkRelativePathExists = (relativePath: string) => {
    const absolutePath = path.join(folderPath, relativePath);
    return checkPathExist(absolutePath);
  };

  const getRelativeFolder = (relativePath: string) => {
    const absolutePath = path.join(folderPath, relativePath);
    const isDir = fs.lstatSync(absolutePath).isDirectory();

    if (!isDir) {
      throw new Error(
        `folder path '${absolutePath}' does not exist or it is not a directory`,
      );
    }

    return FileSystemFolderBrowserNode(absolutePath);
  };

  const listFiles = async () => {
    const paths = await getPathsFromFolder(folderPath);
    return paths
      .filter((p) => fs.lstatSync(p).isFile())
      .map((f) => FileSystemFileNode(f));
  };

  return {
    path: {
      join: (args) => resolvePromise(path.join(...args)),
    },
    checkRelativePathExists: (path) =>
      resolvePromise(checkRelativePathExists(path)),
    getFolder: (path) => resolvePromise(getRelativeFolder(path)),
    listFilesFromFolder: () => listFiles(),
    getFile: (path) => resolvePromise(FileSystemFileNode(path)),
  };
};
