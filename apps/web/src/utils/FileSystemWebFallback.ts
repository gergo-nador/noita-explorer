import {
  FileSystemFile,
  FileSystemFolderBrowserApi,
} from '@noita-explorer/model';
import { FileWithDirectoryAndFileHandle } from 'browser-fs-access';
import { resolvePromise } from '@noita-explorer/tools';
import { Buffer } from 'buffer';

export const FileSystemFolderBrowserFallback = (
  fallbackHandlers: FileWithDirectoryAndFileHandle[],
  level: number,
): FileSystemFolderBrowserApi => {
  if (fallbackHandlers.length === 0) {
    throw new Error('No file handlers were provided');
  }

  const folderName = fallbackHandlers[0].webkitRelativePath.split('/')[level];

  console.log('FileSystemFolderBrowserFallback ', folderName, fallbackHandlers);

  const files = fallbackHandlers
    .filter((f) => f.webkitRelativePath.split('/').length === level + 2)
    .map((f) => FileSystemFileFallback(f));

  return {
    getName: () => folderName,
    path: {
      join: (args) => resolvePromise(args.join('/')),
    },
    getFile: async (path) => {
      const result = evaluateRelativePath(path, fallbackHandlers, level + 1);

      if (result && result.type === 'file') {
        return result.result as FileSystemFile;
      }

      throw new Error(`Path ${path} not found`);
    },
    getFolder: async (path) => {
      const result = evaluateRelativePath(path, fallbackHandlers, level + 1);

      if (result && result.type === 'folder') {
        return result.result as FileSystemFolderBrowserApi;
      }

      console.log('getFolder', path, result, folderName);

      throw new Error(`Path ${path} not found`);
    },
    listFilesFromFolder: () => resolvePromise(files),
    checkRelativePathExists: (path) =>
      resolvePromise(
        evaluateRelativePath(path, fallbackHandlers, level + 1) !== undefined,
      ),
  };
};

export const FileSystemFileFallback = (
  file: FileWithDirectoryAndFileHandle,
): FileSystemFile => {
  const getNameWithoutExtension = () => {
    const lastIndex = file.name.lastIndexOf('.');
    if (lastIndex === -1) {
      return file.name;
    }

    return file.name.substring(0, lastIndex);
  };

  return {
    getName: () => file.name,
    getNameWithoutExtension: getNameWithoutExtension,
    read: {
      asText: () => file.text(),
      asTextLines: () => file.text().then((t) => t.split('\n')),
      asImageBase64: () =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }),
      asBuffer: async () => {
        const buffer = await file.arrayBuffer();
        return buffer as Buffer;
      },
    },
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
      type: 'folder',
      result: FileSystemFolderBrowserFallback(
        filteredItems,
        level + pathElements.length - 1,
      ),
    };
  }
  if (filteredItems.length === 1) {
    return {
      type: 'file',
      result: FileSystemFileFallback(filteredItems[0]),
    };
  }

  return undefined;
};
