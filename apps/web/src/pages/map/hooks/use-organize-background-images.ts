import { ImagePngDimension } from '@noita-explorer/model';
import {
  StreamInfoBackground,
  StreamInfoFileFormat,
} from '@noita-explorer/model-noita';
import { useEffect, useState } from 'react';

interface Props {
  streamInfo: StreamInfoFileFormat;
}

export const useOrganizeBackgroundImages = ({ streamInfo }: Props) => {
  const [backgrounds, setBackgrounds] = useState<
    Record<number, Record<number, StreamInfoBackground[]>>
  >({});
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    fetch('/data-wak-image-dimensions')
      .then((res) => res.json())
      .then((data: Record<string, ImagePngDimension>) => {
        const backgrounds = streamInfo.backgrounds;

        const chunkOrganized: Record<
          number,
          Record<number, StreamInfoBackground[]>
        > = {};

        for (const background of backgrounds) {
          const imgSize = data[background.fileName];
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
      });
  }, [streamInfo?.backgrounds]);

  return { backgrounds, isLoaded };
};
