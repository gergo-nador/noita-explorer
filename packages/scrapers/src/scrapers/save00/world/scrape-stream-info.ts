import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';

import { createBufferReader } from '@noita-explorer/tools';
import {
  StreamInfoBackground,
  StreamInfoChunkInfo,
  StreamInfoRaw,
} from '@noita-explorer/model-noita';
import { uncompressNoitaFile } from '../../../utils/noita-file-uncompress/uncompress-noita-file.ts';
import { readBufferArray } from '../../../utils/buffer-reader-utils/read-buffer-array.ts';
import { readBufferString } from '../../../utils/buffer-reader-utils/read-buffer-string.ts';
import { noitaPaths } from '../../../main.ts';

const STREAMINFO_VERSION = 24;

export const scrapeStreamInfo = async ({
  save00DirectoryApi,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
}): Promise<StreamInfoRaw | undefined> => {
  const streamInfoPath = await save00DirectoryApi.path.join(
    noitaPaths.save00.world.stream_info,
  );

  const pathExist =
    await save00DirectoryApi.checkRelativePathExists(streamInfoPath);
  if (!pathExist) return undefined;

  const streamInfoFile = await save00DirectoryApi.getFile(streamInfoPath);

  const uncompressedStreamInfoBuffer =
    await uncompressNoitaFile(streamInfoFile);
  const bufferReader = createBufferReader(uncompressedStreamInfoBuffer);

  const version = bufferReader.readInt32BE();
  if (version !== STREAMINFO_VERSION) {
    throw new Error(
      `Invalid streaminfo buffer version. Expected ${STREAMINFO_VERSION}, received ${version}`,
    );
  }

  const seed = bufferReader.readUInt32BE();
  const framesPlayed = bufferReader.readInt32BE();
  const secondsPlayed = bufferReader.readFloatBE();
  // unknown counter
  bufferReader.jumpBytes(8);

  const backgrounds = readBufferArray(bufferReader).iterate((bufferReader) => {
    const posX = bufferReader.readFloatBE();
    const posY = bufferReader.readFloatBE();
    const fileName = readBufferString(bufferReader);

    const zIndex = bufferReader.readFloatBE();
    const offsetX = bufferReader.readFloatBE();
    const offsetY = bufferReader.readFloatBE();

    return {
      position: { x: posX, y: posY },
      fileName,
      zIndex,
      offset: { x: offsetX, y: offsetY },
    } satisfies StreamInfoBackground;
  });

  const chunkCount = bufferReader.readInt32BE();
  const entitySchemaHash = readBufferString(bufferReader);

  const gameModeIndex = bufferReader.readInt32BE();
  const gameModeName = readBufferString(bufferReader);
  // game mode steam id
  bufferReader.jumpBytes(8);

  const nonNollaModUsed = bufferReader.readBool();

  const saveTimeYear = bufferReader.readInt16BE();
  const saveTimeMonth = bufferReader.readInt16BE();
  const saveTimeDay = bufferReader.readInt16BE();
  const saveTimeHour = bufferReader.readInt16BE();
  const saveTimeMinute = bufferReader.readInt16BE();
  const saveTimeSecond = bufferReader.readInt16BE();

  const newGamePlusName = readBufferString(bufferReader);

  // skip camera related data
  bufferReader.jumpBytes(4 * 4);

  const chunkInfos = readBufferArray(bufferReader, {
    length: chunkCount,
  }).iterate((bufferReader) => {
    const posX = bufferReader.readInt32BE();
    const posY = bufferReader.readInt32BE();
    const loaded = bufferReader.readBool();

    return {
      position: { x: posX, y: posY },
      loaded,
    } satisfies StreamInfoChunkInfo;
  });

  return {
    seed,
    framesPlayed,
    secondsPlayed,
    backgrounds: backgrounds.items,
    chunkCount,
    entitySchemaHash,
    gameModeIndex,
    gameModeName,
    nonNollaModUsed,
    saveAndQuitDate: new Date(
      saveTimeYear,
      saveTimeMonth,
      saveTimeDay,
      saveTimeHour,
      saveTimeMinute,
      saveTimeSecond,
    ),
    newGamePlusName,
    chunkInfo: chunkInfos.items,
  } satisfies StreamInfoRaw;
};
