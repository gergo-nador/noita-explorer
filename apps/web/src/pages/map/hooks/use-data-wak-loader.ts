import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { bufferHelpers } from '@noita-explorer/tools';

/**
 * Downloads the data.wak file as an array buffer
 */
export const useDataWakLoader = () => {
  const [state, setState] = useState({
    dataWakBuffer: undefined as Buffer | undefined,
    isError: false,
    progress: { loaded: 0, total: 1 },
  });

  useEffect(() => {
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.responseType = 'arraybuffer';

    xmlHttpRequest.onload = function () {
      // call `this` to avoid memory leak https://stackoverflow.com/questions/21554346/xmlhttprequest-freeing-after-use
      let dataWakBufferTemp: ArrayBuffer | SharedArrayBuffer = this
        .response as ArrayBuffer;

      if (window.isSecureContext && window.crossOriginIsolated) {
        const sharedBuffer = new SharedArrayBuffer(
          dataWakBufferTemp.byteLength,
        );
        bufferHelpers.copy(dataWakBufferTemp, sharedBuffer);
        new Uint8Array(sharedBuffer).set(new Uint8Array(dataWakBufferTemp));
        dataWakBufferTemp = sharedBuffer;
      }

      const dataWakBuffer = Buffer.from(dataWakBufferTemp);

      setState((state) => ({
        ...state,
        isError: false,
        dataWakBuffer: dataWakBuffer,
      }));
    };

    xmlHttpRequest.onerror = () =>
      setState((state) => ({ ...state, isError: true }));

    xmlHttpRequest.onprogress = (progress) => {
      if (progress.type !== 'progress') return;

      setState((state) => ({
        ...state,
        progress: { loaded: progress.loaded, total: progress.total },
      }));
    };

    xmlHttpRequest.open('GET', import.meta.env.VITE_DATA_WAK_URL);
    xmlHttpRequest.send();

    return () => xmlHttpRequest.abort();
  }, []);

  return state;
};
