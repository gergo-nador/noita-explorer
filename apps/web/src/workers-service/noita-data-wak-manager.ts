import { Buffer } from 'buffer';
import { FileSystemDirectoryAccessDataWakMemory } from '@noita-explorer/file-systems/data-wak-memory-fs';
import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { createDataWakBroadcastChannel } from '../utils/channels/data-wak-broadcast-channel.ts';

type DataWakManagerType = {
  isFailed: () => boolean;
  wait: () => Promise<FileSystemDirectoryAccess | undefined>;
  get: () => FileSystemDirectoryAccess | undefined;
};

export const noitaDataWakManager = ((): DataWakManagerType => {
  // we don't want to trigger an actual fetch when rendering SSG pages
  if (__SSG__) {
    return {
      isFailed: () => false,
      wait: () => Promise.resolve(undefined),
      get: () => undefined,
    };
  }

  const dataWakBroadcastChannel = createDataWakBroadcastChannel();

  let error = false;
  let isSent = false;
  let dataWakDir: FileSystemDirectoryAccess | undefined = undefined;

  const xmlHttpRequest = new XMLHttpRequest();
  xmlHttpRequest.open('GET', import.meta.env.VITE_DATA_WAK_URL);
  xmlHttpRequest.responseType = 'arraybuffer';

  xmlHttpRequest.onload = () => {
    const buffer = Buffer.from(xmlHttpRequest.response);
    dataWakDir = FileSystemDirectoryAccessDataWakMemory(buffer);
  };
  xmlHttpRequest.onerror = () => (error = true);
  xmlHttpRequest.onprogress = (progress) => {
    if (progress.type !== 'progress') return;

    dataWakBroadcastChannel.postProgress({
      total: progress.total,
      loaded: progress.loaded,
    });
  };

  xmlHttpRequest.send();

  function wait() {
    return new Promise((resolve, reject) => {
      if (!isSent) {
        xmlHttpRequest.send();
        isSent = true;
      }

      xmlHttpRequest.onload = () => resolve(1);
      xmlHttpRequest.onerror = () => reject(1);
    });
  }

  return {
    wait: async () => {
      await wait();
      return dataWakDir;
    },
    get: () => dataWakDir,
    isFailed: () => error,
  };
})();
