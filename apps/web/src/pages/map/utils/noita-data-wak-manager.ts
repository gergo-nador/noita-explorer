import { Buffer } from 'buffer';
import { FileSystemDirectoryAccessDataWakMemory } from '@noita-explorer/file-systems/data-wak-memory-fs';
import { FileSystemDirectoryAccess } from '@noita-explorer/model';

export const noitaDataWakManager = (() => {
  // we don't want to trigger an actual fetch when rendering SSG pages
  if (__SSG__) {
    return {
      getDataWak: () =>
        Promise.resolve() as unknown as Promise<FileSystemDirectoryAccess>,
    };
  }

  const dataWak = fetch('/data.wak').then(async (res) => {
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return FileSystemDirectoryAccessDataWakMemory(buffer);
  });

  return { getDataWak: () => dataWak };
})();
