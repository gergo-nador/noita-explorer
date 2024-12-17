import {
  FileSystemFile,
  FileSystemFolderBrowserApi,
} from '@noita-explorer/model';
import { resolvePromise } from '@noita-explorer/tools';
import { Buffer } from 'buffer';

// Implementation of FileSystemFile
export const FileSystemFolderBrowserWeb = (
  directoryHandle: FileSystemDirectoryHandle,
): FileSystemFolderBrowserApi => {
  return {
    path: {
      join: (args) => resolvePromise(args.join('/')),
    },
    listFilesFromFolder: async () => {
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

      return files.map((f) => FileSystemFileWeb(f));
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
      return FileSystemFileWeb(fileHandle);
    },

    getFolder: async (path) => {
      const parts = path.split('/');
      let currentHandle = directoryHandle;
      for (const part of parts) {
        currentHandle = await currentHandle.getDirectoryHandle(part, {
          create: false,
        });
      }

      return FileSystemFolderBrowserWeb(currentHandle);
    },
  };
};

export const FileSystemFileWeb = (
  fileHandle: FileSystemFileHandle,
): FileSystemFile => {
  const readAsText = () => {
    return fileHandle.getFile().then((f) => f.text());
  };

  return {
    getName: () => fileHandle.name,
    getNameWithoutExtension: () => {
      const name = fileHandle.name;
      const lastIndex = name.lastIndexOf('.');
      if (lastIndex === -1) return name;
      return name.substring(0, lastIndex);
    },
    read: {
      asText: async () => readAsText(),
      asTextLines: async () => readAsText().then((t) => t.split('\n')),
      asImageBase64: async () => {
        const blob = await fileHandle.getFile();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      },
      asBuffer: async () =>
        fileHandle.getFile().then((f) => f.arrayBuffer()) as Promise<Buffer>,
    },
  };
};
