import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { promiseHelper } from '@noita-explorer/tools';
import { FileSystemFileAccessBrowserApi } from './FileSystemFileAccessBrowserApi.ts';

export const FileSystemDirectoryAccessBrowserApi = (
  directoryHandle: FileSystemDirectoryHandle,
): FileSystemDirectoryAccess => {
  return {
    getName: () => directoryHandle.name,
    path: {
      join: (args) => promiseHelper.fromValue(args.join('/')),
    },
    listFilesFromDirectory: async () => {
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

      return files.map((f) => FileSystemFileAccessBrowserApi(f));
    },
    checkRelativePathExists: async (path) => {
      try {
        const parts = path.split('/');
        let currentHandle = directoryHandle;
        for (const part of parts) {
          currentHandle = await currentHandle.getDirectoryHandle(part, {
            create: false,
          });
        }
        return true;
      } catch {
        return false;
      }
    },
    getFile: async (path) => {
      const fileHandle = await directoryHandle.getFileHandle(path);
      return FileSystemFileAccessBrowserApi(fileHandle);
    },

    getDirectory: async (path) => {
      const parts = path.split('/');
      let currentHandle = directoryHandle;
      for (const part of parts) {
        currentHandle = await currentHandle.getDirectoryHandle(part, {
          create: false,
        });
      }

      return FileSystemDirectoryAccessBrowserApi(currentHandle);
    },
  };
};
