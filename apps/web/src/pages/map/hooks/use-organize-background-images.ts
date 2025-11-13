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
      const imgDimensions = data.mediaDimensions;
      const backgrounds = streamInfo.backgrounds;

      const availableBackgrounds = backgrounds
        .map((bg) => ({
          background: bg,
          imgSize: imgDimensions[bg.fileName],
        }))
        .filter((bg) => bg.imgSize)
        .map((bg) => ({
          instance: bg.background,
          width: bg.imgSize.width,
          height: bg.imgSize.height,
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
  }, [data.mediaDimensions, streamInfo]);

  return { backgrounds, isLoaded };
};
