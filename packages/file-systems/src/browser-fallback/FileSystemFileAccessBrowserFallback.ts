import { FileWithDirectoryAndFileHandle } from 'browser-fs-access';
import { FileSystemFileAccess } from '@noita-explorer/model';
import { extractFileNameWithoutExtension } from '../common.ts';

export const FileSystemFileAccessBrowserFallback = (
  file: FileWithDirectoryAndFileHandle,
): FileSystemFileAccess => {
  return {
    getFullPath: () => file.webkitRelativePath,
    getName: () => file.name,
    getNameWithoutExtension: () => extractFileNameWithoutExtension(file.name),
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
