import { FileSystemFileAccess } from '@noita-explorer/model';
import path from 'path';
import { EOL } from 'os';
import { nodeFileSystemHelpers } from './node-file-system-helpers.ts';

export const FileSystemFileAccessNode = (
  filePath: string,
): FileSystemFileAccess => {
  if (!nodeFileSystemHelpers.checkPathExist(filePath)) {
    throw new Error(`file path does not exist: ${filePath}`);
  }

  const parsedPath = path.parse(filePath);

  return {
    getFullPath: () => filePath,
    getName: () => parsedPath.base,
    getNameWithoutExtension: () => parsedPath.name,
    read: {
      asText: () => nodeFileSystemHelpers.readFileAsText(filePath),
      asImageBase64: () => nodeFileSystemHelpers.readImageAsBase64(filePath),
      asBuffer: () => nodeFileSystemHelpers.readFileAsBuffer(filePath),
      asTextLines: async () => {
        const text = await nodeFileSystemHelpers.readFileAsText(filePath);
        return text.split(EOL).map((row) => row.trim());
      },
    },
    delete: async () => {
      await nodeFileSystemHelpers.deleteFile(filePath);
    },
    modify: {
      fromBuffer: () => {
        throw new Error(
          'modify.fromBuffer is not implemented in FileSystemFileAccessNode',
        );
      },
      fromText: () => {
        throw new Error(
          'modify.fromText is not implemented in FileSystemFileAccessNode',
        );
      },
    },
  };
};
