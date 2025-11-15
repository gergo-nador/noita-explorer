import {
  StreamInfoBackground,
  StreamInfoFileFormat,
} from '@noita-explorer/model-noita';
import { useEffect, useState } from 'react';
import { useCurrentRunService } from '../../../services/current-run/use-current-run-service.ts';
import { Map2dOrganizedObject } from '../noita-map.types.ts';
import { organizeItemsInto2dChunks } from '../utils/organize-items-into-2d-chunks.ts';
import { useDataWakService } from '../../../services/data-wak/use-data-wak-service.ts';

export const useOrganizeBackgroundImages = () => {
  const { data } = useDataWakService();
  const { streamInfo } = useCurrentRunService();
  const [backgrounds, setBackgrounds] = useState<
    Map2dOrganizedObject<StreamInfoBackground[]>
  >({});
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!streamInfo) return;

    async function load(streamInfo: StreamInfoFileFormat) {
      const mediaIndex = data.mediaIndex;
      const backgrounds = streamInfo.backgrounds;

      const availableBackgrounds = backgrounds
        .map((bg) => ({
          background: bg,
          imgSize: mediaIndex[bg.fileName]?.size,
        }))
        .filter((bg) => bg.imgSize)
        .map((bg) => ({
          instance: bg.background,
          width: bg.imgSize?.width ?? 0,
          height: bg.imgSize?.height ?? 0,
          x: bg.background.position.x,
          y: bg.background.position.y,
        }));

      const chunkOrganized = organizeItemsInto2dChunks({
        items: availableBackgrounds,
      });

      setIsLoaded(true);
      setBackgrounds(chunkOrganized);
    }

    void load(streamInfo);
  }, [data.mediaIndex, streamInfo]);

  return { backgrounds, isLoaded };
};
