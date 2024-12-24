import { FileWithDirectoryAndFileHandle } from 'browser-fs-access';
import { FileSystemFileAccess } from '@noita-explorer/model';

export const FileSystemFileAccessBrowserFallback = (
  file: FileWithDirectoryAndFileHandle,
): FileSystemFileAccess => {
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
