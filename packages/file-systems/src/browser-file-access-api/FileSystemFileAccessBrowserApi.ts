import { FileSystemFileAccess } from '@noita-explorer/model';

export const FileSystemFileAccessBrowserApi = (
  fileHandle: FileSystemFileHandle,
): FileSystemFileAccess => {
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
