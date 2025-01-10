import { Buffer } from 'buffer';
import { WakMemoryFile } from './WakMemoryFile.ts';

/**
 * Little-endian 32-bit read from buffer.
 */
function getUint32LE(buf: Buffer, offset: number): number {
  return buf.readUInt32LE(offset);
}

export const unWakker = (wakBuffer: Buffer): WakMemoryFile[] => {
  const data = wakBuffer;
  const headerSize = 16;

  if (data.length < headerSize) {
    throw new Error(`Invalid or too-small data.wak`);
  }

  const numFiles = getUint32LE(data, 4);
  const pathSize = getUint32LE(data, 8);

  if (pathSize > data.length) {
    throw new Error('Path size out of range.');
  }

  let offset = headerSize;
  const fileSystem: WakMemoryFile[] = [];

  for (let i = 0; i < numFiles; i++) {
    const filePos = getUint32LE(data, offset);
    const fileSize = getUint32LE(data, offset + 4);
    const pathLen = getUint32LE(data, offset + 8);
    offset += 12;

    const pathBuf = data.subarray(offset, offset + pathLen);
    offset += pathLen;
    const filePath = pathBuf.toString('utf8');

    if (filePos + fileSize > data.length) {
      throw new Error(
        `File data out of range: pos=${filePos}, size=${fileSize}`,
      );
    }

    const memoryFile: WakMemoryFile = {
      path: filePath,
      getFileBytes: () => data.subarray(filePos, filePos + fileSize),
    };

    fileSystem.push(memoryFile);
  }

  return fileSystem;
};
