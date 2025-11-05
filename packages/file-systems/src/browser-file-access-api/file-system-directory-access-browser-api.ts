import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { promiseHelper } from '@noita-explorer/tools';
import { FileSystemFileAccessBrowserApi } from './file-system-file-access-browser-api.ts';

const FILE_PATH_DIVIDER = '/';

export const FileSystemDirectoryAccessBrowserApi = (
  directoryHandle: FileSystemDirectoryHandle,
  path?: string,
): FileSystemDirectoryAccess => {
  if (path === undefined) {
    path = directoryHandle.name;
  } else {
    path += FILE_PATH_DIVIDER + directoryHandle.name;
  }

  const directory = {
    getName: () => directoryHandle.name,
    getFullPath: () => path,
    path: {
      join: (args) => promiseHelper.fromValue(args.join(FILE_PATH_DIVIDER)),
      split: (path) => promiseHelper.fromValue(path.split(FILE_PATH_DIVIDER)),
    },
    listFiles: async () => {
      const files: FileSystemFileHandle[] = [];

      if (
        !('entries' in directoryHandle) ||
        typeof directoryHandle.entries !== 'function'
      ) {
        throw new Error('directoryHandler.entries is not supported');
      }

      for await (const entry of directoryHandle.entries()) {
        const handle = entry[1] as
          | FileSystemFileHandle
          | FileSystemDirectoryHandle;

        if (handle.kind === 'file') {
          files.push(handle);
        }
      }

      return files.map((f) => FileSystemFileAccessBrowserApi(f, path));
    },
    listDirectories: async () => {
      const directories: FileSystemDirectoryHandle[] = [];

      if (
        !('entries' in directoryHandle) ||
        typeof directoryHandle.entries !== 'function'
      ) {
        throw new Error('directoryHandler.entries is not supported');
      }

      for await (const entry of directoryHandle.entries()) {
        const handle = entry[1] as
          | FileSystemFileHandle
          | FileSystemDirectoryHandle;

        if (handle.kind === 'directory') {
          directories.push(handle);
        }
      }

      return directories.map((d) =>
        FileSystemDirectoryAccessBrowserApi(d, path),
      );
    },
    checkRelativePathExists: async (path) => {
      try {
        await directoryHandle.getDirectoryHandle(path, {
          create: false,
        });
        return true;
      } catch {
        return false;
      }
    },
    getFile: async (path) => {
      const parts = path.split(FILE_PATH_DIVIDER);
      let currentHandle = directoryHandle;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        currentHandle = await currentHandle.getDirectoryHandle(part, {
          create: false,
        });
      }

      const lastPart = parts[parts.length - 1];
      const fileHandle = await currentHandle.getFileHandle(lastPart);
      return FileSystemFileAccessBrowserApi(fileHandle, path);
    },

    getDirectory: async (path) => {
      const parts = path.split(FILE_PATH_DIVIDER);
      let currentHandle = directoryHandle;
      for (const part of parts) {
        currentHandle = await currentHandle.getDirectoryHandle(part, {
          create: false,
        });
      }

      return FileSystemDirectoryAccessBrowserApi(currentHandle, path);
    },
    createFile: async (fileName) => {
      const fileHandle = await directoryHandle.getFileHandle(fileName, {
        create: true,
      });

      return FileSystemFileAccessBrowserApi(fileHandle, path);
    },
  } satisfies FileSystemDirectoryAccess;

  return {
    // for easier debugging
    _path: path,
    ...directory,
  } as FileSystemDirectoryAccess;
};
