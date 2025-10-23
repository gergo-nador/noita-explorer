import {
  FileSystemFileAccess,
  RgbaColor,
  StringKeyDictionary,
} from '@noita-explorer/model';

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

export type MaterialImageCache = StringKeyDictionary<ImageData>;
export type MaterialColorCache = StringKeyDictionary<RgbaColor>;
