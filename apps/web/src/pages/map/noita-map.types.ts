import { FileSystemFileAccess } from '@noita-explorer/model';

export type NoitaPetriFileCollection = Record<
  // x coordinate
  number,
  Record<
    // y coordinate
    number,
    // corresponding file
    FileSystemFileAccess
  >
>;

export type NoitaEntityFileCollection = Record<number, FileSystemFileAccess>;
