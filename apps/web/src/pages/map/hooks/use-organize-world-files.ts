import { useEffect, useState } from 'react';
import { getSave00FolderHandle } from '../../../utils/browser-noita-api/browser-noita-api.ts';
import { useSave00Store } from '../../../stores/save00.ts';
import {
  ChunkInfoCollection,
  MapBounds,
  NoitaPetriFileCollection,
} from '../noita-map.types.ts';
import { useCurrentRunService } from '../../../services/current-run/use-current-run-service.ts';

export const useOrganizeWorldFiles = () => {
  const { status } = useSave00Store();
  const { streamInfo } = useCurrentRunService();

  const [petriFileCollection, setPetriFileCollection] =
    useState<NoitaPetriFileCollection>({});
  const [chunkInfos, setChunkInfos] = useState<ChunkInfoCollection>({});
  const [mapBounds, setMapBounds] = useState<MapBounds | undefined>();

  useEffect(() => {
    if (status !== 'loaded') return;

    getSave00FolderHandle()
      .then((folder) => folder.getDirectory('world'))
      .then((folder) => folder.listFiles())
      .then(async (files) => {
        // petri files
        const petriFiles = files
          .filter((file) => file.getName().endsWith('.png_petri'))
          .map((file) => {
            const chunkCoordinate = extractDoubleFileNumbers(file.getName());
            if (!chunkCoordinate) return;

            return {
              chunkCoordinate,
              file,
            };
          });

        // map bounds
        const bounds: MapBounds = { minX: 0, maxY: 0, minY: 0, maxX: 0 };

        const petriFileCollection: NoitaPetriFileCollection = {};
        for (const file of petriFiles) {
          if (!file) continue;

          // save the map bounds
          if (bounds.minX > file.chunkCoordinate.num1) {
            bounds.minX = file.chunkCoordinate.num1;
          }
          if (bounds.maxX < file.chunkCoordinate.num1) {
            bounds.maxX = file.chunkCoordinate.num1;
          }
          if (bounds.minY > file.chunkCoordinate.num2) {
            bounds.minY = file.chunkCoordinate.num2;
          }
          if (bounds.maxY < file.chunkCoordinate.num2) {
            bounds.maxY = file.chunkCoordinate.num2;
          }

          const x = file.chunkCoordinate.num1 / 512;
          const y = file.chunkCoordinate.num2 / 512;

          if (!(x in petriFileCollection)) {
            petriFileCollection[x] = {};
          }

          petriFileCollection[x][y] = file.file;
        }
        setPetriFileCollection(petriFileCollection);
        setMapBounds(bounds);

        // chunk infos
        const chunkInfos: ChunkInfoCollection = {};
        for (const streamInfoChunkInfo of streamInfo.chunkInfo) {
          const x = streamInfoChunkInfo.position.x;
          if (!(x in chunkInfos)) {
            chunkInfos[x] = {};
          }

          const y = streamInfoChunkInfo.position.y;
          chunkInfos[x][y] = streamInfoChunkInfo;
        }

        setChunkInfos(chunkInfos);
      });
  }, [status, streamInfo]);

  return {
    petriFileCollection,
    mapBounds,
    chunkInfos,
  };
};

/**
 * Extracts two numbers from a string with the format 'world_NUM1_NUM2.png_petri'.
 *
 * @param {string} inputString The string to extract numbers from.
 * @returns {object|null} An object with the two numbers { num1, num2 } or null if no match is found.
 */
function extractDoubleFileNumbers(inputString: string) {
  const regex = /_(-?\d+)_(-?\d+)/;

  const match = inputString.match(regex);

  if (match) {
    const num1 = parseInt(match[1], 10);
    const num2 = parseInt(match[2], 10);
    return { num1, num2 };
  }

  return undefined;
}
