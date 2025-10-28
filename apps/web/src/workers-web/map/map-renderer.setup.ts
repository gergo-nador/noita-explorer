import { arrayHelpers } from '@noita-explorer/tools';
import { StringKeyDictionary } from '@noita-explorer/model';
import { fetchDataWak } from '../../utils/browser-noita-api/fetch-data-wak.ts';

export async function mapRendererSetup() {
  const noitaDataWak = await fetchDataWak();
  const materialsDict = arrayHelpers.asDict(noitaDataWak.materials, 'id');

  const materialColorCache: StringKeyDictionary<ImageData> = {};
  for (const material of noitaDataWak.materials) {
    if (!material.graphicsImagePath) {
      continue;
    }

    const imgData = await fetchAndDecodeImage(material.graphicsImagePath);
    if (!imgData) {
      continue;
    }

    materialColorCache[material.id] = imgData;
  }

  return { materials: materialsDict, materialColorCache };
}

async function fetchAndDecodeImage(url: string) {
  const response = await fetch('/' + url);
  const blob = await response.blob();

  const imageBitmap = await createImageBitmap(blob);

  const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  ctx.drawImage(imageBitmap, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  imageBitmap.close();
  return imageData;
}
