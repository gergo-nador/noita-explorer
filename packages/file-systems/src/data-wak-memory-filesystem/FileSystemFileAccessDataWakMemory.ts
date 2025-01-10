import { WakMemoryFile } from './wak/WakMemoryFile.ts';
import { FileSystemFileAccess } from '@noita-explorer/model';
import { promiseHelper } from '@noita-explorer/tools';
import { extractFileNameWithoutExtension } from '../common.ts';

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
      asTextLines: () => readAsText().then((t) => t.split('\n')),
      asImageBase64: () => {
        throw new Error();
      },
    },
  };
};
