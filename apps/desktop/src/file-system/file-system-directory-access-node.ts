import fs from 'fs';
import path from 'path';
import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { nodeFileSystemHelpers } from '../tools/file-system';
import { promiseHelper } from '@noita-explorer/tools';
import { FileSystemFileAccessNode } from './file-system-file-access-node';

export const FileSystemDirectoryAccessNode = (
  directoryPath: string,
): FileSystemDirectoryAccess => {
  if (!nodeFileSystemHelpers.checkPathExist(directoryPath)) {
    throw new Error(`Directory path '${directoryPath}' does not exist`);
  }

  const checkRelativePathExists = (relativePath: string) => {
    const absolutePath = path.join(directoryPath, relativePath);
    return nodeFileSystemHelpers.checkPathExist(absolutePath);
  };

  const getAbsolutePath = (relativePath: string) => {
    return path.join(directoryPath, relativePath);
  };

  const getRelativeDirectory = (relativePath: string) => {
    const absolutePath = getAbsolutePath(relativePath);
    const isDir = fs.lstatSync(absolutePath).isDirectory();

    if (!isDir) {
      throw new Error(
        `Directory path '${absolutePath}' does not exist or it is not a directory`,
      );
    }

    return FileSystemDirectoryAccessNode(absolutePath);
  };

  const listFiles = async () => {
    const paths =
      await nodeFileSystemHelpers.getPathsFromDirectory(directoryPath);

    return paths
      .map((p) => getAbsolutePath(p))
      .filter((p) => fs.lstatSync(p).isFile())
      .map((f) => FileSystemFileAccessNode(f));
  };

  const listDirectories = async () => {
    const paths =
      await nodeFileSystemHelpers.getPathsFromDirectory(directoryPath);

    return paths
      .map((p) => getAbsolutePath(p))
      .filter((p) => fs.lstatSync(p).isDirectory())
      .map((d) => FileSystemDirectoryAccessNode(d));
  };

  return {
    getName: () => path.parse(directoryPath).name,
    getFullPath: () => directoryPath,
    path: {
      join: (args) => promiseHelper.fromValue(path.join(...args)),
      split: (path_) => promiseHelper.fromValue(path_.split(path.sep)),
    },
    checkRelativePathExists: (path) =>
      promiseHelper.fromValue(checkRelativePathExists(path)),
    getDirectory: (path) => promiseHelper.fromValue(getRelativeDirectory(path)),
    listFiles: () => listFiles(),
    listDirectories: () => listDirectories(),
    getFile: (path) =>
      promiseHelper.fromValue(FileSystemFileAccessNode(getAbsolutePath(path))),
  };
};
