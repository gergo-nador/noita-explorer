import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { unWakker } from './wak/un-wakker.ts';
import { Buffer } from 'buffer';
import {
  DirectoryLogicForFileLists,
  DirectoryLogicForFileLists_File,
} from '../directory-logic-for-file-lists.ts';
import { FileSystemFileAccessDataWakMemory } from './file-system-file-access-data-wak-memory.ts';

const FILE_PATH_DIVIDER = '/';

export const FileSystemDirectoryAccessDataWakMemory = (
  wakBuffer: Buffer,
): FileSystemDirectoryAccess => {
  const fileSystem = unWakker(wakBuffer);

  // append "data_wak_root" to each of the path so
  // that data/ folder is not the root directory but
  // a subdirectory of the root
  fileSystem.forEach(
    (f) => (f.path = 'data_wak_root' + FILE_PATH_DIVIDER + f.path),
  );

  const files: DirectoryLogicForFileLists_File[] = fileSystem.map((f) => ({
    path: f.path,
    pathSplit: f.path.split(FILE_PATH_DIVIDER),
    getFileAccessObject: () => FileSystemFileAccessDataWakMemory(f),
  }));

  return DirectoryLogicForFileLists({
    files: files,
    level: 0,
    pathDivider: FILE_PATH_DIVIDER,
  });
};
