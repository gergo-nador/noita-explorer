import { StringKeyDictionary } from '@noita-explorer/model';
import {
  NoitaDataWakScrapeResult,
  NoitaScrapedMedia,
  NoitaScrapedMediaImage,
  NoitaWakData,
} from '@noita-explorer/model-noita';
import { imageHelpers } from '@noita-explorer/tools';
import { scaleUpImage } from './images/scale-up-image';
import { createMaterialContainerImages } from './images/create-material-container-images';

interface Props {
  dataWakResult: NoitaDataWakScrapeResult;
  dataWak: NoitaWakData;
}

export const scrapeMedia = async ({ dataWakResult, dataWak }: Props) => {
  const perks: StringKeyDictionary<NoitaScrapedMedia[]> = {};
  await appendBase64ImagesToMedia(dataWakResult.perks.data, perks);

  const spells: StringKeyDictionary<NoitaScrapedMedia[]> = {};
  await appendBase64ImagesToMedia(dataWakResult.spells.data, spells);

  const enemies = convertScrapedMediaToDict(dataWakResult.enemyMedia.data);
  await appendBase64ImagesToMedia(dataWakResult.enemies.data, enemies);

  const materials: StringKeyDictionary<NoitaScrapedMedia[]> = {};
  await appendBase64ImagesToMedia(dataWakResult.materials.data, materials, {
    skipHighQuality: true,
  });
  await createMaterialContainerImages(dataWak.materials, materials);

  const wands: StringKeyDictionary<NoitaScrapedMedia[]> = {};
  await appendBase64ImagesToMedia(
    dataWakResult.wandConfigs.data.map(
      (wand): Base64ImageHolder => ({
        id: wand.spriteId,
        imageBase64: wand.imageBase64,
      }),
    ),
    wands,
    {
      skipHighQuality: true,
    },
  );

  const orbs = convertScrapedMediaToDict(dataWakResult.orbGifs.data);

  return {
    perks: perks,
    spells: spells,
    enemies: enemies,
    orbs: orbs,
    materials: materials,
    wands: wands,
  };
};

const convertScrapedMediaToDict = (
  dict: StringKeyDictionary<NoitaScrapedMedia>,
): StringKeyDictionary<NoitaScrapedMedia[]> => {
  const entries = Object.entries(dict).map((entry) => {
    const mediaArray = [entry[1]];
    return [entry[0], mediaArray];
  });

  return Object.fromEntries(entries);
};

interface Base64ImageHolder {
  id: string;
  imageBase64?: string;
}
const appendBase64ImagesToMedia = async (
  list: Base64ImageHolder[],
  media: StringKeyDictionary<NoitaScrapedMedia[]>,
  options?: { skipHighQuality?: boolean },
) => {
  for (const item of list) {
    const id = item.id;

    if (!(id in media)) {
      media[id] = [];
    }

    if (!item.imageBase64) {
      continue;
    }

    const imageSize = await imageHelpers.getImageSizeBase64(item.imageBase64);

    // base image
    {
      const image: NoitaScrapedMediaImage = {
        type: 'image',
        name: 'default',
        imageBase64: item.imageBase64,
        width: imageSize.width,
        height: imageSize.height,
      };

      media[id].push(image);
    }

    if (options?.skipHighQuality) {
      continue;
    }

    // high quality image (around 500 pixels height or width)
    {
      const maxSize = 500;

      let newWidth: number;
      let newHeight: number;

      if (imageSize.width === imageSize.height) {
        newWidth = maxSize;
        newHeight = maxSize;
      } else if (imageSize.width < imageSize.height) {
        newWidth = maxSize;
        newHeight = Math.round((maxSize / imageSize.width) * imageSize.height);
      } else {
        newWidth = Math.round((maxSize / imageSize.height) * imageSize.width);
        newHeight = maxSize;
      }

      const highQualityImageBase64 = await scaleUpImage({
        base64: item.imageBase64,
        width: newWidth,
        height: newHeight,
      });

      const highQualityImage: NoitaScrapedMediaImage = {
        type: 'image',
        name: 'default-high-q',
        imageBase64: highQualityImageBase64,
        width: newWidth,
        height: newHeight,
      };

      media[id].push(highQualityImage);
    }
  }
};
