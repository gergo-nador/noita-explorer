import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';

const findFileInDirectory = async (
  fileName: string,
  directory: FileSystemDirectoryAccess,
): Promise<FileSystemFileAccess | undefined> => {
  const filePathExists = await directory.checkRelativePathExists(fileName);
  if (filePathExists) {
    return await directory.getFile(fileName);
  }

  const directories = await directory.listDirectories();
  for (const dir of directories) {
    const file = await findFileInDirectory(fileName, dir);
    if (file !== undefined) {
      return file;
    }
  }

  return undefined;
};

const findAllFilesInDirectory = async (
  fileName: string,
  directories: FileSystemDirectoryAccess[],
): Promise<FileSystemFileAccess[]> => {
  const arr: FileSystemFileAccess[] = [];

  let directoryQueue: FileSystemDirectoryAccess[] = [...directories];

  while (directoryQueue.length > 0) {
    const currentDir = directoryQueue.shift()!;
    const filePathExists = await currentDir.checkRelativePathExists(fileName);
    if (filePathExists) {
      const file = await currentDir.getFile(fileName);
      arr.push(file);
    }

    const subDirectories = await currentDir.listDirectories();
    directoryQueue = [...directoryQueue, ...subDirectories];
  }

  return arr;
};

export const fileSystemAccessHelpers = {
  findAllFilesInDirectory,
  findFileInDirectory,
};
