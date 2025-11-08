import { FileSystemFileAccess } from '@noita-explorer/model';
import { StreamInfoChunkInfo } from '@noita-explorer/model-noita';

export type Map2dOrganizedObject<T> = Record<number, Record<number, T>>;

export type NoitaPetriFileCollection =
  Map2dOrganizedObject<FileSystemFileAccess>;
export type ChunkInfoCollection = Map2dOrganizedObject<StreamInfoChunkInfo>;

export type NoitaEntityFileCollection = Record<number, FileSystemFileAccess>;

export interface MapBounds {
  minY: number;
  maxY: number;
  minX: number;
  maxX: number;
}
