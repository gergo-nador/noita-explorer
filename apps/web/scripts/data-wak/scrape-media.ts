import { StringKeyDictionary } from '@noita-explorer/model';
import {
  NoitaDataWakScrapeResult,
  NoitaScrapedMedia,
  NoitaScrapedMediaImage,
} from '@noita-explorer/model-noita';
import { imageHelpers } from '@noita-explorer/tools';

interface Props {
  dataWakResult: NoitaDataWakScrapeResult;
}

export const scrapeMedia = async ({ dataWakResult }: Props) => {
  const perks: StringKeyDictionary<NoitaScrapedMedia[]> = {};
  await appendBase64ImagesToMedia(dataWakResult.perks.data, perks);

  const spells: StringKeyDictionary<NoitaScrapedMedia[]> = {};
  await appendBase64ImagesToMedia(dataWakResult.spells.data, spells);

  const enemies = convertScrapedMediaToArray(dataWakResult.enemyMedia.data);
  await appendBase64ImagesToMedia(dataWakResult.enemies.data, enemies);

  const orbs = convertScrapedMediaToArray(dataWakResult.orbGifs.data);

  return { perks: perks, spells: spells, enemies: enemies, orbs: orbs };
};

const convertScrapedMediaToArray = (
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
  imageBase64: string;
}
const appendBase64ImagesToMedia = async (
  list: Base64ImageHolder[],
  media: StringKeyDictionary<NoitaScrapedMedia[]>,
) => {
  for (const item of list) {
    const id = item.id;

    if (!(id in media)) {
      media[id] = [];
    }

    const imageSize = await imageHelpers.getImageSizeBase64(item.imageBase64);

    const image: NoitaScrapedMediaImage = {
      type: 'image',
      imageType: 'default',
      imageBase64: item.imageBase64,
      width: imageSize.width,
      height: imageSize.height,
    };

    media[id].push(image);
  }
};
