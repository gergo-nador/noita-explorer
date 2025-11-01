export interface DataWakBroadcastChannelProgressPayload {
  total: number;
  loaded: number;
}

interface Props {
  onProgress?: (props: DataWakBroadcastChannelProgressPayload) => void;
}

export function createDataWakBroadcastChannel(props?: Props) {
  const channel = new BroadcastChannel('data_wak_bc');

  channel.onmessage = (message) => {
    const data = message.data;
    if (typeof data !== 'object') return;
    if (!('type' in data)) return;

    if (data.type === 'progress') {
      props?.onProgress?.({ total: data.total, loaded: data.loaded });
      return;
    }
  };

  function postProgress({
    total,
    loaded,
  }: DataWakBroadcastChannelProgressPayload) {
    channel.postMessage({ type: 'progress', total, loaded });
  }

  return {
    close: () => channel.close(),
    postProgress,
    getIsLoaded: () => fetch('/data-initiate').then(({ ok }) => ok),
  };
}
