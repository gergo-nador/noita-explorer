import { arrayHelpers } from '@noita-explorer/tools';
import {
  FileSystemDirectoryAccess,
  ImagePngDimension,
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
  mediaDimensions: StringKeyDictionary<ImagePngDimension>;
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

    const imageBitmap = await decodeImage({
      dataWakDirectory,
      path: material.graphicsImagePath,
      offscreenCanvas,
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
    mediaDimensions: noitaDataWak.mediaDimensions,
  };
}

async function decodeImage({
  dataWakDirectory,
  path,
  offscreenCanvas,
  ctx,
}: {
  dataWakDirectory: FileSystemDirectoryAccess;
  path: string;
  offscreenCanvas: OffscreenCanvas;
  ctx: OffscreenCanvasRenderingContext2D;
}) {
  const file = await dataWakDirectory.getFile(path);
  const fileBuffer = await file.read.asBuffer();
  const arrayBuffer = fileBuffer.buffer as ArrayBuffer;

  const blob = new Blob([arrayBuffer], { type: 'image/png' });
  const imageBitmap = await createImageBitmap(blob);

  offscreenCanvas.width = imageBitmap.width;
  offscreenCanvas.height = imageBitmap.height;

  ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

  ctx.drawImage(imageBitmap, 0, 0);

  const imageData = ctx.getImageData(
    0,
    0,
    offscreenCanvas.width,
    offscreenCanvas.height,
  );

  imageBitmap.close();

  return imageData;
}
