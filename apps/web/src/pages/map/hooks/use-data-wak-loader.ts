import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { bufferHelpers } from '@noita-explorer/tools';

const xmlHttpRequestService = (url: string) => {
  const xmlHttpRequest = new XMLHttpRequest();
  xmlHttpRequest.responseType = 'arraybuffer';
  xmlHttpRequest.open('GET', url);

  let isSent = false;

  function send() {
    if (isSent) return;

    isSent = true;
    xmlHttpRequest.send();
  }

  return {
    // prevent user to call send directly on the xmlHttpRequest
    xmlHttpRequest: xmlHttpRequest as Omit<XMLHttpRequest, 'send'>,
    send,
  };
};

let xmlHttpRequestServiceInstance: {
  xmlHttpRequest: Omit<XMLHttpRequest, 'send'>;
  send: VoidFunction;
};

/**
 * Downloads the data.wak file as an array buffer
 */
export const useDataWakLoader = () => {
  const [state, setState] = useState({
    dataWakBuffer: undefined as Buffer | undefined,
    isError: false,
    progress: 0 as number | undefined,
  });

  useEffect(() => {
    if (__SSG__) return;
    if (!xmlHttpRequestServiceInstance) {
      xmlHttpRequestServiceInstance = xmlHttpRequestService(
        import.meta.env.VITE_DATA_WAK_URL,
      );
    }

    const xmlHttpRequest = xmlHttpRequestServiceInstance.xmlHttpRequest;

    const onLoad = () => {
      // call `this` to avoid memory leak https://stackoverflow.com/questions/21554346/xmlhttprequest-freeing-after-use
      let dataWakBufferTemp: ArrayBuffer | SharedArrayBuffer =
        xmlHttpRequest.response as ArrayBuffer;

      if (window.isSecureContext && window.crossOriginIsolated) {
        const sharedBuffer = new SharedArrayBuffer(
          dataWakBufferTemp.byteLength,
        );
        bufferHelpers.copy(dataWakBufferTemp, sharedBuffer);
        dataWakBufferTemp = sharedBuffer;
      }

      const dataWakBuffer = Buffer.from(dataWakBufferTemp);

      setState((state) => ({
        ...state,
        isError: false,
        dataWakBuffer: dataWakBuffer,
      }));
    };

    if (xmlHttpRequest.readyState === 4) {
      if (xmlHttpRequest.status < 400) {
        onLoad();
      } else {
        setState((state) => ({ ...state, isError: true }));
      }
      return;
    }

    const onProgress = (progress: ProgressEvent<EventTarget>) => {
      if (progress.type !== 'progress') return;
      if (!progress.lengthComputable) return;

      setState((state) => ({
        ...state,
        progress: (100 * progress.loaded) / progress.total,
      }));
    };

    const onError = () => setState((state) => ({ ...state, isError: true }));

    xmlHttpRequest.addEventListener('load', onLoad);
    xmlHttpRequest.addEventListener('progress', onProgress);
    xmlHttpRequest.addEventListener('error', onError);

    xmlHttpRequestServiceInstance.send();

    return () => {
      xmlHttpRequest.removeEventListener('load', onLoad);
      xmlHttpRequest.removeEventListener('progress', onProgress);
      xmlHttpRequest.removeEventListener('error', onError);
    };
  }, []);

  return state;
};
