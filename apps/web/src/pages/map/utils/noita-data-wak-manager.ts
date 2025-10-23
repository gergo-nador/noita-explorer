import { Buffer } from 'buffer';
import { FileSystemDirectoryAccessDataWakMemory } from '@noita-explorer/file-systems/data-wak-memory-fs';

export const noitaDataWakManager = (() => {
  const dataWak = fetch('/data.wak').then(async (res) => {
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return FileSystemDirectoryAccessDataWakMemory(buffer);
  });

  return { getDataWak: () => dataWak };
})();
