interface Props {
  onProgress?: () => void;
}

export function createDataWakBroadcastChannel(props?: Props) {
  const channel = new BroadcastChannel('data_wak_bc');

  channel.onmessage = (message) => {
    const data = message.data;
    if (typeof data !== 'object') return;
    if (!('type' in data)) return;

    if (data.type === 'progress') {
      props?.onProgress?.();
      return;
    }
  };

  function postProgress({ total, loaded }: { total: number; loaded: number }) {
    channel.postMessage({ type: 'progress', total, loaded });
  }

  return {
    close: () => channel.close(),
    postProgress,
  };
}
