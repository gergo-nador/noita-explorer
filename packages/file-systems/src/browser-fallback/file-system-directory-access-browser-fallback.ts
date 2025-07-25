import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { FileWithDirectoryAndFileHandle } from 'browser-fs-access';
import {
  DirectoryLogicForFileLists,
  DirectoryLogicForFileLists_File,
} from '../directory-logic-for-file-lists.ts';
import { FileSystemFileAccessBrowserFallback } from './file-system-file-access-browser-fallback.ts';

const FILE_PATH_DIVIDER = '/';

export const FileSystemDirectoryAccessBrowserFallback = (
  fallbackHandlers: FileWithDirectoryAndFileHandle[],
): FileSystemDirectoryAccess => {
  const files: DirectoryLogicForFileLists_File[] = fallbackHandlers.map(
    (f) => ({
      path: f.webkitRelativePath,
      pathSplit: f.webkitRelativePath.split(FILE_PATH_DIVIDER),
      getFileAccessObject: () => FileSystemFileAccessBrowserFallback(f),
    }),
  );

  return DirectoryLogicForFileLists({
    files: files,
    level: 0,
    pathDivider: FILE_PATH_DIVIDER,
  });
};
