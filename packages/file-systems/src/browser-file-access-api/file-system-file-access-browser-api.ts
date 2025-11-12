import { FileSystemFileAccess } from '@noita-explorer/model';
import { Buffer } from 'buffer';
import {
  extractFileNameWithoutExtension,
  splitTextToLines,
} from '../common.ts';

export const FileSystemFileAccessBrowserApi = (
  fileHandle: FileSystemFileHandle,
  path: string,
): FileSystemFileAccess => {
  path += '/' + fileHandle.name;

  const readAsText = () => {
    return fileHandle.getFile().then((f) => f.text());
  };

  const file = {
    getFullPath: () => path,
    getName: () => fileHandle.name,
    getNameWithoutExtension: () =>
      extractFileNameWithoutExtension(fileHandle.name),
    supportsTransferable: () => fileHandle,
    read: {
      asText: async () => readAsText(),
      asTextLines: async () => readAsText().then(splitTextToLines),
      asImageBase64: async () => {
        const blob = await fileHandle.getFile();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      },
      asBuffer: async () => {
        const file = await fileHandle.getFile();
        const arrayBuffer = await file.arrayBuffer();
        return Buffer.from(arrayBuffer);
      },
    },
    delete: async () => {
      // @ts-expect-error .remove() function exists, the IDE doesn't know about it
      await fileHandle.remove();
    },
    modify: {
      fromText: async (text) => {
        const writable = await fileHandle.createWritable();
        await writable.write(text);
        await writable.close();
      },
      fromBuffer: async (buffer) => {
        const writable = await fileHandle.createWritable();
        await writable.write(buffer);
        await writable.close();
      },
    },
  } satisfies FileSystemFileAccess;

  return {
    _path: path,
    ...file,
  } as FileSystemFileAccess;
};
