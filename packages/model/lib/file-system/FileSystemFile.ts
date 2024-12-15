import { FileReadOptions } from './FileReadOptions';

export interface FileSystemFile {
  getName: () => string;
  getNameWithoutExtension: () => string;
  read: FileReadOptions;
}
