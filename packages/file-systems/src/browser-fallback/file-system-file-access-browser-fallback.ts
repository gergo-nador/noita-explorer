import { FileWithDirectoryAndFileHandle } from 'browser-fs-access';
import { FileSystemFileAccess } from '@noita-explorer/model';
import {
  extractFileNameWithoutExtension,
  splitTextToLines,
} from '../common.ts';
import { Buffer } from 'buffer';

export const FileSystemFileAccessBrowserFallback = (
  file: FileWithDirectoryAndFileHandle,
): FileSystemFileAccess => {
  return {
    getFullPath: () => file.webkitRelativePath,
    getName: () => file.name,
    getNameWithoutExtension: () => extractFileNameWithoutExtension(file.name),
    supportsTransferable: () => undefined,
    read: {
      asText: () => file.text(),
      asTextLines: () => file.text().then(splitTextToLines),
      asImageBase64: () =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }),
      asBuffer: async () => {
        const buffer = await file.arrayBuffer();
        return Buffer.from(buffer);
      },
    },
    delete: () => {
      throw new Error(
        'Delete operation not supported for FileSystemFileAccessBrowserFallback',
      );
    },
    modify: {
      fromText: () => {
        throw new Error(
          'Modify operation not supported for FileSystemFileAccessBrowserFallback',
        );
      },
      fromBuffer: () => {
        throw new Error(
          'Modify operation not supported for FileSystemFileAccessBrowserFallback',
        );
      },
    },
  };
};
