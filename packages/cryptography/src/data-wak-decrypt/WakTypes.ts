export interface FiletableEntry {
  file_offset: number;
  file_size: number;
  filename: string;
}

export class Constants {
  static readonly wak_key_seed = 0;
  static readonly wak_header_IV_seed = 1;
  static readonly wak_filetable_IV_seed = 2147483646;
}
