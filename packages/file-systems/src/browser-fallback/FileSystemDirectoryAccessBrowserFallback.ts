import {
  FileSystemFileAccess,
  FileSystemDirectoryAccess,
} from '@noita-explorer/model';
import { FileWithDirectoryAndFileHandle } from 'browser-fs-access';
import { promiseHelper } from '@noita-explorer/tools';
import { FileSystemFileAccessBrowserFallback } from './FileSystemFileAccessBrowserFallback.ts';

export const FileSystemDirectoryAccessBrowserFallback = (
  fallbackHandlers: FileWithDirectoryAndFileHandle[],
  level: number,
): FileSystemDirectoryAccess => {
  if (fallbackHandlers.length === 0) {
    throw new Error('No file handlers were provided');
  }

  const directoryName =
    fallbackHandlers[0].webkitRelativePath.split('/')[level];

  const files = fallbackHandlers
    .filter((f) => f.webkitRelativePath.split('/').length === level + 2)
    .map((f) => FileSystemFileAccessBrowserFallback(f));

  const directories = fallbackHandlers
    .filter((d) => d.webkitRelativePath.split('/').length > level + 2)
    .map((d) => {
      return {
        name: d.webkitRelativePath.split('/')[level + 2],
      };
    });

  const getDirectory = async (path: string) => {
    const result = evaluateRelativePath(path, fallbackHandlers, level + 1);

    if (result && result.type === 'directory') {
      return result.result as FileSystemDirectoryAccess;
    }

    throw new Error(`Path ${path} not found`);
  };

  return {
    getName: () => directoryName,
    path: {
      join: (args) => promiseHelper.fromValue(args.join('/')),
    },
    getFile: async (path) => {
      const result = evaluateRelativePath(path, fallbackHandlers, level + 1);

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
        evaluateRelativePath(path, fallbackHandlers, level + 1) !== undefined,
      ),
  };
};

const evaluateRelativePath = (
  path: string,
  items: FileWithDirectoryAndFileHandle[],
  level: number,
) => {
  const pathElements = path.split('/');
  let filteredItems = items;

  for (let i = 0; i < pathElements.length; i++) {
    const levelAdjustedIterator = i + level;

    filteredItems = filteredItems.filter(
      (item) =>
        item.webkitRelativePath.split('/')[levelAdjustedIterator] ===
        pathElements[i],
    );
  }

  if (
    filteredItems.every(
      (item) =>
        item.webkitRelativePath.split('/').length > pathElements.length + level,
    )
  ) {
    return {
      type: 'directory',
      result: FileSystemDirectoryAccessBrowserFallback(
        filteredItems,
        level + pathElements.length - 1,
      ),
    };
  }
  if (filteredItems.length === 1) {
    return {
      type: 'file',
      result: FileSystemFileAccessBrowserFallback(filteredItems[0]),
    };
  }

  return undefined;
};
