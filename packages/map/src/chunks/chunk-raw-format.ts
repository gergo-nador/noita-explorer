export interface ChunkRawFormat {
  version: number;
  width: number;
  height: number;

  cellData: number[];
  materialIds: string[];
  customColors: number[];
}
