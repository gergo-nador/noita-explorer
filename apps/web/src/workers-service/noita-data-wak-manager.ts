import { Buffer } from 'buffer';
import { FileSystemDirectoryAccessDataWakMemory } from '@noita-explorer/file-systems/data-wak-memory-fs';
import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { createDataWakBroadcastChannel } from '../utils/channels/data-wak-broadcast-channel.ts';

type DataWakManagerType = {
  isFailed: () => boolean;
  init: () => Promise<void>;
  get: () => FileSystemDirectoryAccess | undefined;
};

export const noitaDataWakManager = ((): DataWakManagerType => {
  // we don't want to trigger an actual fetch when rendering SSG pages
  if (__SSG__) {
    return {
      isFailed: () => false,
      init: () => Promise.resolve(),
      get: () => undefined,
    };
  }

  const dataWakBroadcastChannel = createDataWakBroadcastChannel();

  let error = false;
  let isSent = false;
  let dataWakDir: FileSystemDirectoryAccess | undefined = undefined;

  const xmlHttpRequest = new XMLHttpRequest();
  xmlHttpRequest.responseType = 'arraybuffer';

  xmlHttpRequest.addEventListener('load', () => {
    const buffer = Buffer.from(xmlHttpRequest.response);
    dataWakDir = FileSystemDirectoryAccessDataWakMemory(buffer);
  });
  xmlHttpRequest.onerror = () => (error = true);
  xmlHttpRequest.onprogress = (progress) => {
    if (progress.type !== 'progress') return;

    dataWakBroadcastChannel.postProgress({
      total: progress.total,
      loaded: progress.loaded,
    });
  };

  xmlHttpRequest.open('GET', import.meta.env.VITE_DATA_WAK_URL);

  return {
    init: () => {
      if (!isSent) {
        xmlHttpRequest.send();
        isSent = true;
      }

      return new Promise((resolve, reject) => {
        xmlHttpRequest.addEventListener('load', () => resolve());
        xmlHttpRequest.addEventListener('error', () => reject());
      });
    },
    get: () => dataWakDir,
    isFailed: () => error,
  };
})();
