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
import { NoitaMaterial, NoitaWakBiomes } from '@noita-explorer/model-noita';

interface Props {
  dataWakDirectory: FileSystemDirectoryAccess;
}

export interface MapRendererSetupData {
  materials: StringKeyDictionary<NoitaMaterial>;
  materialColorCache: StringKeyDictionary<ImageData>;
  fastLzCompressor: FastLZCompressor;
  biomes: NoitaWakBiomes;
}

export async function mapRendererSetup({
  dataWakDirectory,
}: Props): Promise<MapRendererSetupData> {
  const noitaDataWak = await fetchDataWak();
  const materialsDict = arrayHelpers.asDict(noitaDataWak.materials, 'id');

  const materialColorCache: StringKeyDictionary<ImageData> = {};
  for (const material of noitaDataWak.materials) {
    if (!material.graphicsImagePath) {
      continue;
    }

    const imageBitmap = await decodeImage(
      dataWakDirectory,
      material.graphicsImagePath,
    );

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
  };
}

async function decodeImage(
  dataWakDirectory: FileSystemDirectoryAccess,
  path: string,
) {
  const file = await dataWakDirectory.getFile(path);
  const fileBuffer = await file.read.asBuffer();
  const arrayBuffer = fileBuffer.buffer as ArrayBuffer;

  const blob = new Blob([arrayBuffer], { type: 'image/png' });
  const imageBitmap = await createImageBitmap(blob);

  const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  ctx.drawImage(imageBitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  imageBitmap.close();

  return imageData;
}
