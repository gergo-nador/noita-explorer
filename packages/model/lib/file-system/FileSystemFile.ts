import { FileReadOptions } from './FileReadOptions';

export interface FileSystemFile {
  read: () => FileReadOptions;
}
