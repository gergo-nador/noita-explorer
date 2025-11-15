import { arrayHelpers } from '@noita-explorer/tools';
import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { fetchDataWak } from '../../utils/browser-noita-api/fetch-data-wak.ts';
import {
  createFastLzCompressor,
  FastLZCompressor,
} from '@noita-explorer/fastlz';
import {
  DataWakMediaIndex,
  NoitaMaterial,
  NoitaWakBiomes,
} from '@noita-explorer/model-noita';
import { convertDataWakFileToImageData } from '@noita-explorer/map';

interface Props {
  dataWakDirectory: FileSystemDirectoryAccess;
}

export interface MapRendererSetupData {
  materials: StringKeyDictionary<NoitaMaterial>;
  materialColorCache: StringKeyDictionary<ImageData>;
  fastLzCompressor: FastLZCompressor;
  biomes: NoitaWakBiomes;
  mediaIndex: StringKeyDictionary<DataWakMediaIndex>;
}

export async function mapRendererSetup({
  dataWakDirectory,
}: Props): Promise<MapRendererSetupData> {
  const noitaDataWak = await fetchDataWak();
  const materialsDict = arrayHelpers.asDict(noitaDataWak.materials, 'id');

  const offscreenCanvas = new OffscreenCanvas(1, 1);
  const ctx = offscreenCanvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error(
      'OffscreenCanvasRenderingContext2d not supported in web worker',
    );
  }

  const materialColorCache: StringKeyDictionary<ImageData> = {};
  for (const material of noitaDataWak.materials) {
    if (!material.graphicsImagePath) {
      continue;
    }

    const file = await dataWakDirectory.getFile(material.graphicsImagePath);
    const imageBitmap = await convertDataWakFileToImageData({
      file,
      ctx,
    });

    if (!imageBitmap) {
      continue;
    }

    materialColorCache[material.id] = imageBitmap;
  }

  const fastLzCompressor = await createFastLzCompressor();

  return {
    materials: materialsDict,
    materialColorCache,
    fastLzCompressor,
    biomes: noitaDataWak.biomes,
    mediaIndex: noitaDataWak.mediaIndex,
  };
}
