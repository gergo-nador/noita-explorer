import { Buffer } from 'buffer';
import { WakMemoryFile } from './wak-memory-file.ts';
import { createBufferReader } from '@noita-explorer/tools';

export const unWakker = (wakBuffer: Buffer): WakMemoryFile[] => {
  const bufferReader = createBufferReader(wakBuffer);

  bufferReader.jumpBytes(4);
  const numFiles = bufferReader.readUInt32LE();
  bufferReader.jumpBytes(8);

  const fileSystem: WakMemoryFile[] = [];

  for (let i = 0; i < numFiles; i++) {
    const filePos = bufferReader.readUInt32LE();
    const fileSize = bufferReader.readUInt32LE();
    const pathLen = bufferReader.readUInt32LE();

    const filePath = bufferReader.readString(pathLen, 'utf-8');

    if (filePos + fileSize > wakBuffer.length) {
      throw new Error(
        `File data out of range: pos=${filePos}, size=${fileSize}`,
      );
    }

    const memoryFile: WakMemoryFile = {
      path: filePath,
      getFileBytes: () => wakBuffer.subarray(filePos, filePos + fileSize),
    };

    fileSystem.push(memoryFile);
  }

  return fileSystem;
};
