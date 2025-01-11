import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { arrayHelpers, promiseHelper } from '@noita-explorer/tools';

export interface DirectoryLogicForFileLists_File {
  path: string;
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
  const pathSegments = files[0].path.split(pathDivider);

  if (pathSegments.length <= level) {
    throw new Error(`Insufficient path segments in "${files[0].path}".`);
  }

  const directoryName = pathSegments[level];

  // Verify all files share the same directory name at this level
  for (const f of files) {
    const splitF = f.path.split(pathDivider);
    if (splitF[level] !== directoryName) {
      throw new Error(
        `Inconsistent directory naming at level=${level}.` +
          ` Expected "${directoryName}", but got "${splitF[level]}" in path "${f.path}."`,
      );
    }
  }

  const subFiles = files
    .filter((f) => f.path.split(pathDivider).length === level + 2)
    .map((f) => f.getFileAccessObject());

  const subDirectoriesFilter = files
    .filter((d) => d.path.split(pathDivider).length > level + 2)
    .map((d) => ({
      name: d.path.split(pathDivider)[level + 1],
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
  };
};

const evaluateRelativePath = (
  path: string,
  items: DirectoryLogicForFileLists_File[],
  level: number,
  pathDivider: string,
) => {
  const pathElements = path.split(pathDivider);
  let filteredItems = items;

  for (let i = 0; i < pathElements.length; i++) {
    const levelAdjustedIterator = i + level;

    filteredItems = filteredItems.filter(
      (item) =>
        item.path.split(pathDivider)[levelAdjustedIterator] === pathElements[i],
    );
  }

  const isAllItemsInSubArray =
    filteredItems.length > 0 &&
    filteredItems.every(
      (item) =>
        item.path.split(pathDivider).length > pathElements.length + level,
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
