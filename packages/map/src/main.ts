import { NoitaCompressedFile } from './noita-compressed-file.ts';
import { uncompressNoitaFile } from './uncompress-noita-file.ts';
import { parseRawChunk } from './chunks/parse-raw-chunk.ts';
import { FileSystemFileAccess } from '@noita-explorer/model';
import { Buffer } from 'buffer';

export async function testParseChunk(file: FileSystemFileAccess) {
  let fileBuffer = await file.read.asBuffer();
  // ensure file buffer is an actual buffer
  if (!Buffer.isBuffer(fileBuffer)) {
    fileBuffer = Buffer.from(fileBuffer);
  }

  const compressedFile: NoitaCompressedFile = {
    compressedDataSize: fileBuffer.readInt32LE(0),
    uncompressedDataSize: fileBuffer.readInt32LE(4),
    data: fileBuffer.subarray(8),
  };

  console.log('compressed expected size', compressedFile.compressedDataSize);
  console.log('compressed file size', compressedFile.data.length);
  console.log();

  const output = await uncompressNoitaFile(compressedFile);

  console.log(
    'uncompressed expected size',
    compressedFile.uncompressedDataSize,
  );
  console.log('uncompressed file size', output.length);
  console.log();

  const chunk = parseRawChunk(output);
  console.log('chunk', chunk);
}
