import {
  createDataWakBroadcastChannel,
  DataWakBroadcastChannelProgressPayload,
} from '../../../utils/channels/data-wak-broadcast-channel.ts';
import { useEffect, useState } from 'react';

export const useDataWakLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [progress, setProgress] =
    useState<DataWakBroadcastChannelProgressPayload>({
      loaded: 0,
      total: 1,
    });

  useEffect(() => {
    const dataWakChannel = createDataWakBroadcastChannel({
      onProgress: (payload) => {
        setProgress(payload);
      },
    });

    dataWakChannel
      .getIsLoaded()
      .then(() => setIsLoaded(true))
      .catch(() => setIsError(true));

    return () => dataWakChannel.close();
  }, []);

  return { isLoaded, isError, progress };
};
