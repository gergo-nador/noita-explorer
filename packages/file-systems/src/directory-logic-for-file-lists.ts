import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { arrayHelpers, promiseHelper } from '@noita-explorer/tools';

export interface DirectoryLogicForFileLists_File {
  path: string;
  pathSplit: string[];
  getFileAccessObject: () => FileSystemFileAccess;
}

interface DirectoryLogicForFileListsProps {
  files: DirectoryLogicForFileLists_File[];
  level: number;
  pathDivider: string;
}

/**
 * Internal helper logic object
 * @param level
 * @param files
 * @param pathDivider
 * @constructor
 */
export const DirectoryLogicForFileLists = ({
  level,
  files,
  pathDivider,
}: DirectoryLogicForFileListsProps): FileSystemDirectoryAccess => {
  if (files.length === 0) {
    throw new Error('No files were provided');
  }
  const pathSegments = files[0].pathSplit;

  if (pathSegments.length <= level) {
    throw new Error(`Insufficient path segments in "${files[0].path}".`);
  }

  const directoryName = pathSegments[level];

  // Verify all files share the same directory name at this level
  for (const f of files) {
    const splitF = f.pathSplit;
    if (splitF[level] !== directoryName) {
      throw new Error(
        `Inconsistent directory naming at level=${level}.` +
          ` Expected "${directoryName}", but got "${splitF[level]}" in path "${f.path}."`,
      );
    }
  }

  const subFiles = files
    .filter((f) => f.pathSplit.length === level + 2)
    .map((f) => f.getFileAccessObject());

  const subDirectoriesFilter = files
    .filter((d) => d.pathSplit.length > level + 2)
    .map((d) => ({
      name: d.pathSplit[level + 1],
    }));

  const subDirectories = arrayHelpers.uniqueBy(
    subDirectoriesFilter,
    (d) => d.name,
  );

  const getDirectory = async (path: string) => {
    const result = evaluateRelativePath(path, files, level + 1, pathDivider);

    if (result && result.type === 'directory') {
      return result.result as FileSystemDirectoryAccess;
    }

    throw new Error(`Path ${path} not found`);
  };

  return {
    getName: () => directoryName,
    getFullPath: () =>
      pathSegments.filter((_, index) => index <= level).join(pathDivider),
    path: {
      split: (path) => promiseHelper.fromValue(path.split(pathDivider)),
      join: (args) => promiseHelper.fromValue(args.join(pathDivider)),
    },
    getFile: async (path) => {
      const result = evaluateRelativePath(path, files, level + 1, pathDivider);

      if (result && result.type === 'file') {
        return result.result as FileSystemFileAccess;
      }

      throw new Error(`Path ${path} not found`);
    },
    getDirectory: getDirectory,
    listFiles: () => promiseHelper.fromValue(subFiles),
    listDirectories: async () => {
      const directoryApis: FileSystemDirectoryAccess[] = [];

      for (const d of subDirectories) {
        const directoryApi = await getDirectory(d.name);
        directoryApis.push(directoryApi);
      }

      return directoryApis;
    },
    checkRelativePathExists: (path) =>
      promiseHelper.fromValue(
        evaluateRelativePath(path, files, level + 1, pathDivider) !== undefined,
      ),
    createFile: () => {
      throw new Error(
        'Creating file is not allowed for DirectoryLogicForFileLists',
      );
    },
  };
};

const evaluateRelativePath = (
  path: string,
  items: DirectoryLogicForFileLists_File[],
  level: number,
  pathDivider: string,
) => {
  const pathElements = path.split(pathDivider);
  const filteredItems: DirectoryLogicForFileLists_File[] = [];

  for (const item of items) {
    let skipItem = false;

    for (let i = 0; i < pathElements.length; i++) {
      const levelAdjustedIterator = i + level;

      if (item.pathSplit[levelAdjustedIterator] !== pathElements[i]) {
        skipItem = true;
        break;
      }
    }

    if (skipItem) {
      continue;
    }

    filteredItems.push(item);
  }

  const isAllItemsInSubArray =
    filteredItems.length > 0 &&
    filteredItems.every(
      (item) => item.pathSplit.length > pathElements.length + level,
    );

  if (isAllItemsInSubArray) {
    try {
      return {
        type: 'directory',
        result: DirectoryLogicForFileLists({
          files: filteredItems,
          level: level + pathElements.length - 1,
          pathDivider: pathDivider,
        }),
      };
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message + ' | at path ' + path);
      } else {
        throw err;
      }
    }
  }
  if (filteredItems.length === 1) {
    return {
      type: 'file',
      result: filteredItems[0].getFileAccessObject(),
    };
  }

  return undefined;
};
