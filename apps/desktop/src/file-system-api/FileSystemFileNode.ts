import { FileSystemFile } from '@noita-explorer/model';
import {
  checkPathExist,
  readFileAsBuffer,
  readFileAsText,
  readImageAsBase64,
} from '../utils/file-system';
import path from 'path';
import { EOL } from 'os';

export const FileSystemFileNode = (filePath: string): FileSystemFile => {
  if (!checkPathExist(filePath)) {
    throw new Error(`file path does not exist: ${filePath}`);
  }

  const parsedPath = path.parse(filePath);

  return {
    getName: () => parsedPath.base,
    getNameWithoutExtension: () => parsedPath.name,
    read: {
      asText: () => readFileAsText(filePath),
      asImageBase64: () => readImageAsBase64(filePath),
      asBuffer: () => readFileAsBuffer(filePath),
      asTextLines: async () => {
        const text = await readFileAsText(filePath);
        return text.split(EOL);
      },
    },
  };
};
