import { WakMemoryFile } from './wak/WakMemoryFile.ts';
import { FileSystemFileAccess } from '@noita-explorer/model';
import { promiseHelper } from '@noita-explorer/tools';
import {
  extractFileNameWithoutExtension,
  splitTextToLines,
} from '../common.ts';

export const FileSystemFileAccessDataWakMemory = (
  file: WakMemoryFile,
): FileSystemFileAccess => {
  const readAsText = () =>
    promiseHelper.fromValue(file.getFileBytes().toString('utf8'));

  const filePathSplit = file.path.split('/');
  const fileName = filePathSplit[filePathSplit.length - 1];

  return {
    getFullPath: () => file.path,
    getName: () => fileName,
    getNameWithoutExtension: () => extractFileNameWithoutExtension(fileName),
    read: {
      asText: () => readAsText(),
      asBuffer: () => promiseHelper.fromValue(file.getFileBytes()),
      asTextLines: () => readAsText().then(splitTextToLines),
      asImageBase64: async () => {
        const mimeType = getMimeTypeFromExtension(fileName);

        const base64String = file.getFileBytes().toString('base64');

        return `data:${mimeType};base64,${base64String}`;
      },
    },
  };
};

function getMimeTypeFromExtension(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';

  switch (extension) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'bmp':
      return 'image/bmp';
    case 'svg':
      return 'image/svg+xml';
    case 'webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
}
