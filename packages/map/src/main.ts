import fs from 'fs';
import { NoitaCompressedFile } from './noita-compressed-file.ts';

const filePath =
  '/Users/gergo.nador/noita-explorer/packages/map/example-files/world_0_7168.png_petri';
const file = fs.readFileSync(filePath);

const compressedFile: NoitaCompressedFile = {
  compressedDataSize: file.readInt32LE(0),
  uncompressedDataSize: file.readInt32LE(4),
  data: file.subarray(8),
};

console.log('compressed expected size', compressedFile.compressedDataSize);
console.log('compressed file size', compressedFile.data.length);
console.log();

import { decompress } from 'lz77';

const compressedData = compressedFile.data.toString('base64');
const decompressed: string | false = decompress(compressedData);

if (decompressed) {
  const uncompressedDataBuffer = Buffer.from(decompressed, 'base64');

  console.log(
    'uncompressed expected size',
    compressedFile.uncompressedDataSize,
  );
  console.log('uncompressed file size', uncompressedDataBuffer.length);
  console.log();

  console.log('version', uncompressedDataBuffer.readInt32LE(0));
  console.log('width', uncompressedDataBuffer.readInt32LE(4));
  console.log('height', uncompressedDataBuffer.readInt32LE(8));
}

import LZSS from 'valve-lzss';

const lzss = new LZSS();

// Create some sample data
const data = new Uint8Array([1, 2, 3, 4, 5, 5, 5, 5, 5]);

// Compress the data
const compressed = lzss.compress(data);

// Decompress back
const decompressed = lzss.decompress(compressed);

console.log('Original size:', data.length);
console.log('Compressed size:', compressed.length);
console.log(
  'Decompressed matches original:',
  decompressed.every((byte, i) => byte === data[i]),
);
