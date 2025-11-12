import {
  StreamInfoBackground,
  StreamInfoFileFormat,
} from '@noita-explorer/model-noita';
import { FileSystemDirectoryAccessDataWakMemory } from '@noita-explorer/file-systems/data-wak-memory-fs';
import { scrape } from '@noita-explorer/scrapers';
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { useCurrentRunService } from '../../../services/current-run/use-current-run-service.ts';
import { Map2dOrganizedObject } from '../noita-map.types.ts';
import { organizeFilesInto2dChunks } from '../utils/organize-files-into-2d-chunks.ts';

interface Props {
  dataWakBuffer: Buffer | undefined;
}

export const useOrganizeBackgroundImages = ({ dataWakBuffer }: Props) => {
  const { streamInfo } = useCurrentRunService();
  const [backgrounds, setBackgrounds] = useState<
    Map2dOrganizedObject<StreamInfoBackground[]>
  >({});
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!dataWakBuffer || !streamInfo) return;

    async function load(
      dataWakBuffer: Buffer,
      streamInfo: StreamInfoFileFormat,
    ) {
      const dataWakFs = FileSystemDirectoryAccessDataWakMemory(dataWakBuffer);
      const imgDimensions = await scrape.dataWak.imageDimensions({
        dataWakParentDirectoryApi: dataWakFs,
      });

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

      const chunkOrganized = organizeFilesInto2dChunks({
        items: availableBackgrounds,
      });

      setIsLoaded(true);
      setBackgrounds(chunkOrganized);
    }

    void load(dataWakBuffer, streamInfo);
  }, [streamInfo, dataWakBuffer]);

  return { backgrounds, isLoaded };
};
