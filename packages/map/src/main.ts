import fs from 'fs';
import { NoitaCompressedFile } from './noita-compressed-file.ts';
import { createFastLzCompressor } from '@noita-explorer/fastlz';

async function main() {
  const filePath =
    'C:\\Users\\enbi8\\coding\\noita\\noita-explorer\\packages\\map\\example-files\\world_1024_-512.png_petri';
  const file = fs.readFileSync(filePath);

  const compressedFile: NoitaCompressedFile = {
    compressedDataSize: file.readInt32LE(0),
    uncompressedDataSize: file.readInt32LE(4),
    data: file.subarray(8),
  };

  console.log('compressed expected size', compressedFile.compressedDataSize);
  console.log('compressed file size', compressedFile.data.length);
  console.log();

  const fastLzCompressor = await createFastLzCompressor();

  const output = fastLzCompressor.decompressBuffer(compressedFile.data);

  console.log(
    'uncompressed expected size',
    compressedFile.uncompressedDataSize,
  );
  console.log('uncompressed file size', output.length);
  console.log();

  console.log('version', output.readInt32LE(0));
  console.log('width', output.readInt32LE(4));
  console.log('height', output.readInt32LE(8));
}

main();
