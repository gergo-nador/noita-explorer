import {
  StreamInfoBackground,
  StreamInfoFileFormat,
} from '@noita-explorer/model-noita';
import { FileSystemDirectoryAccessDataWakMemory } from '@noita-explorer/file-systems/data-wak-memory-fs';
import { scrape } from '@noita-explorer/scrapers';
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';

interface Props {
  streamInfo: StreamInfoFileFormat | undefined;
  dataWakBuffer: Buffer | undefined;
}

export const useOrganizeBackgroundImages = ({
  streamInfo,
  dataWakBuffer,
}: Props) => {
  const [backgrounds, setBackgrounds] = useState<
    Record<number, Record<number, StreamInfoBackground[]>>
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

      const chunkOrganized: Record<
        number,
        Record<number, StreamInfoBackground[]>
      > = {};

      for (const background of backgrounds) {
        const imgSize = imgDimensions[background.fileName];
        if (!imgSize) {
          // console.error('Could not find image dimension', background);
          continue;
        }

        const leftX = background.position.x;
        const rightX = leftX + imgSize.width;
        const topY = background.position.y;
        const bottomY = topY + imgSize.height;

        const leftXChunk = Math.floor(leftX / 512);
        const rightXChunk = Math.ceil(rightX / 512);
        const topYChunk = Math.floor(topY / 512);
        const bottomYChunk = Math.ceil(bottomY / 512);

        for (let x = leftXChunk; x < rightXChunk; x++) {
          for (let y = topYChunk; y < bottomYChunk; y++) {
            if (!(x in chunkOrganized)) {
              chunkOrganized[x] = {};
            }

            if (!(y in chunkOrganized[x])) {
              chunkOrganized[x][y] = [];
            }

            chunkOrganized[x][y].push(background);
          }
        }
      }

      setIsLoaded(true);
      setBackgrounds(chunkOrganized);
    }

    load(dataWakBuffer, streamInfo);
  }, [streamInfo, dataWakBuffer]);

  return { backgrounds, isLoaded };
};
