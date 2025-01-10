import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { promiseHelper } from '@noita-explorer/tools';
import { unWakker } from './wak/UnWakker.ts';
import { Buffer } from 'buffer';
import { WakMemoryFile } from './wak/WakMemoryFile.ts';
import { FileSystemFileAccessDataWakMemory } from './FileSystemFileAccessDataWakMemory.ts';

const FILE_PATH_DIVIDER = '/';

export const FileSystemDirectoryAccessDataWakMemory = (
  wakBuffer: Buffer,
): FileSystemDirectoryAccess => {
  const fileSystem = unWakker(wakBuffer);
  return FileSystemDirectoryAccessDataWakMemoryInternal(fileSystem, 0);
};

const FileSystemDirectoryAccessDataWakMemoryInternal = (
  wakMemoryFiles: WakMemoryFile[],
  level: number,
): FileSystemDirectoryAccess => {
  if (wakMemoryFiles.length === 0) {
    throw new Error('No files were provided');
  }

  const directoryName = wakMemoryFiles[0].path.split(FILE_PATH_DIVIDER)[level];

  const files = wakMemoryFiles
    .filter((f) => f.path.split(FILE_PATH_DIVIDER).length === level + 2)
    .map((f) => FileSystemFileAccessDataWakMemory(f));

  const directories = wakMemoryFiles
    .filter((d) => d.path.split(FILE_PATH_DIVIDER).length > level + 2)
    .map((d) => {
      return {
        name: d.path.split(FILE_PATH_DIVIDER)[level + 2],
      };
    });

  const getDirectory = async (path: string) => {
    const result = evaluateRelativePath(path, wakMemoryFiles, level + 1);

    if (result && result.type === 'directory') {
      return result.result as FileSystemDirectoryAccess;
    }

    throw new Error(`Path ${path} not found`);
  };

  return {
    getName: () => directoryName,
    path: {
      split: (path) => promiseHelper.fromValue(path.split(FILE_PATH_DIVIDER)),
      join: (args) => promiseHelper.fromValue(args.join(FILE_PATH_DIVIDER)),
    },
    getFile: async (path) => {
      const result = evaluateRelativePath(path, wakMemoryFiles, level + 1);

      if (result && result.type === 'file') {
        return result.result as FileSystemFileAccess;
      }

      throw new Error(`Path ${path} not found`);
    },
    getDirectory: getDirectory,
    listFiles: () => promiseHelper.fromValue(files),
    listDirectories: async () => {
      const directoryApis: FileSystemDirectoryAccess[] = [];

      for (const d of directories) {
        const directoryApi = await getDirectory(d.name);
        directoryApis.push(directoryApi);
      }

      return directoryApis;
    },
    checkRelativePathExists: (path) =>
      promiseHelper.fromValue(
        evaluateRelativePath(path, wakMemoryFiles, level + 1) !== undefined,
      ),
  };
};

const evaluateRelativePath = (
  path: string,
  items: WakMemoryFile[],
  level: number,
) => {
  const pathElements = path.split(FILE_PATH_DIVIDER);
  let filteredItems = items;

  for (let i = 0; i < pathElements.length; i++) {
    const levelAdjustedIterator = i + level;

    filteredItems = filteredItems.filter(
      (item) =>
        item.path.split(FILE_PATH_DIVIDER)[levelAdjustedIterator] ===
        pathElements[i],
    );
  }

  if (
    filteredItems.every(
      (item) =>
        item.path.split(FILE_PATH_DIVIDER).length > pathElements.length + level,
    )
  ) {
    return {
      type: 'directory',
      result: FileSystemDirectoryAccessDataWakMemoryInternal(
        filteredItems,
        level + pathElements.length - 1,
      ),
    };
  }
  if (filteredItems.length === 1) {
    return {
      type: 'file',
      result: FileSystemFileAccessDataWakMemory(filteredItems[0]),
    };
  }

  return undefined;
};
