import { decryptBlockAES128CTR } from './one.ts';
import { Constants, FiletableEntry } from './WakTypes.ts';
import { WakRng } from './WakRng.ts';

export class WakDecryptor {
  /**
   * Decrypts the specified wak_file in-place (like your C# code).
   */
  public static async decryptWak(
    wak_file: Uint8Array,
  ): Promise<FiletableEntry[]> {
    return this.decryptWakInto(wak_file, wak_file);
  }

  /**
   * Decrypts the specified wak_file into a separate output buffer.
   */
  public static async decryptWakInto(
    wak_file: Uint8Array,
    output: Uint8Array,
  ): Promise<FiletableEntry[]> {
    const key = new Uint8Array(16);
    const IV = new Uint8Array(16);

    // generate key, then generate IV for the header
    this.generateIV(key, Constants.wak_key_seed);
    this.generateIV(IV, Constants.wak_header_IV_seed);

    // 1) Decrypt the first 16 bytes (header)
    {
      const decryptedHeader = await decryptBlockAES128CTR(
        key,
        IV,
        wak_file.slice(0, 16),
      );
      output.set(decryptedHeader, 0);
    }

    // read number of files + offset from the decrypted header
    const dvHeader = new DataView(
      output.buffer,
      output.byteOffset,
      output.byteLength,
    );

    const num_files = dvHeader.getInt32(4, true); // little-endian
    const files_offset = dvHeader.getInt32(8, true);

    const fileTable: FiletableEntry[] = [];

    // 2) Decrypt the file table chunk
    //    re-generate the IV for the file table
    this.generateIV(IV, Constants.wak_filetable_IV_seed);
    {
      const tableLen = files_offset - 16;
      const decryptedTable = await decryptBlockAES128CTR(
        key,
        IV,
        wak_file.slice(16, 16 + tableLen),
      );
      output.set(decryptedTable, 16);
    }

    // parse file table entries
    let entry_offset = 16;
    for (let i = 0; i < num_files; i++) {
      // read file_offset, file_size, filename_length
      const file_offset = dvHeader.getInt32(entry_offset, true);
      const file_size = dvHeader.getInt32(entry_offset + 4, true);
      const filename_length = dvHeader.getInt32(entry_offset + 8, true);

      if (output.length <= file_offset) {
        break;
      }

      // read filename
      const filenameBytes = output.slice(
        entry_offset + 12,
        entry_offset + 12 + filename_length,
      );
      const filename = new TextDecoder().decode(filenameBytes);

      // decrypt the actual file chunk
      // re-generate the IV for each file
      this.generateIV(IV, i);

      {
        const decryptedFile = await decryptBlockAES128CTR(
          key,
          IV,
          wak_file.slice(file_offset, file_offset + file_size),
        );

        output.set(decryptedFile, file_offset);
      }

      fileTable[i] = {
        file_offset,
        file_size,
        filename,
      };

      // move to next entry
      entry_offset += 12 + filename_length;
    }

    return fileTable;
  }

  /**
   * Equivalent to your C# GenerateIV(Span<byte> IV, int iseed)
   */
  private static generateIV(IV: Uint8Array, iseed: number): void {
    iseed += 0x165ec8f;
    const prng = new WakRng(iseed < 0 ? iseed + 4294967296.0 : iseed);

    // fill IV in 4 groups of 4 bytes
    for (let i = 0; i < 4; i++) {
      // prng.next() in [0..1)
      // times -2147483648.0 ~ negative 32-bit range
      const next = prng.next();
      const next1 = next * -2147483648.0;
      const n = Math.trunc(next1);
      // write int32 little-endian
      this.writeInt32LE(IV, i * 4, n);
    }
  }

  /**
   * Utility to write a 32-bit little-endian int
   */
  private static writeInt32LE(
    arr: Uint8Array,
    offset: number,
    value: number,
  ): void {
    const dv = new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
    dv.setInt32(offset, value, true);
  }
}
