import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaMaterial, NoitaScrapedMedia } from '@noita-explorer/model-noita';
import {
  getMaterialAllContainerTypes,
  renderMaterialPotion,
  renderMaterialPouch,
} from '../../../src/noita/noita-materials';
import { imageHelpers } from '@noita-explorer/tools';
import * as fs from 'fs';

const potionPng = fs
  .readFileSync('public/images/data-wak/misc/potion.png')
  .toString('base64');
const pouchPng = fs
  .readFileSync('public/images/data-wak/misc/material_pouch.png')
  .toString('base64');

export const createMaterialContainerImages = async (
  materials: NoitaMaterial[],
  dict: StringKeyDictionary<NoitaScrapedMedia[]>,
) => {
  for (const material of materials) {
    const types = getMaterialAllContainerTypes(material);
    if (types.length === 0) {
      continue;
    }

    if (!(material.id in dict)) {
      dict[material.id] = [];
    }

    const mediaArray = dict[material.id];

    if (types.includes('pouch')) {
      const image = await renderMaterialPouch(material, pouchPng);
      const size = await imageHelpers.getImageSizeBase64(image);

      const mediaObj: NoitaScrapedMedia = {
        type: 'image',
        name: 'pouch',
        imageBase64: image,
        width: size.width,
        height: size.height,
      };

      mediaArray.push(mediaObj);
    }
    if (types.includes('pouch')) {
      const image = await renderMaterialPotion(material, potionPng);
      const size = await imageHelpers.getImageSizeBase64(image);

      const mediaObj: NoitaScrapedMedia = {
        type: 'image',
        name: 'potion',
        imageBase64: image,
        width: size.width,
        height: size.height,
      };

      mediaArray.push(mediaObj);
    }
  }
};
