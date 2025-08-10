import { scrapeDataWak, scrapeUtils } from '@noita-explorer/scrapers';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'node:process';
import { Buffer } from 'buffer';
import {
  nodeFileSystemHelpers,
  FileSystemFileAccessNode,
  FileSystemDirectoryAccessDataWakMemory,
} from '@noita-explorer/file-systems';
import { args } from '../utils/process-args';
import { StringKeyDictionary } from '@noita-explorer/model';
import {
  NoitaScrapedMedia,
  NoitaScrapedMediaImage,
} from '@noita-explorer/model-noita';
import { imageHelpers } from '@noita-explorer/tools';

/**
 * Scrapes the data.wak file.
 *
 * Arguments:
 *  - -t: path for translation file
 *  - --data-wak: path to data.wak file
 *  - --o-wak: output path of the data wak json file
 *  - --o-media: output path of the media json file
 */

runScrape(args);

async function runScrape(args: Record<string, string>) {
  if (!('t' in args)) {
    console.log(
      'Translation file path is missing from the arguments. Use the -t path/file.csv to provide the translation file path',
    );
    process.exit(1);
  }

  if (!args['data-wak']) {
    console.log(
      '--data-wak argument must be provided, pointing to the data.wak file',
    );
    process.exit(1);
  }

  if (!args['o-wak']) {
    console.log('--o-wak argument must be provided');
    process.exit(1);
  }

  if (!args['o-media']) {
    console.log('--o-media argument must be provided');
    process.exit(1);
  }

  const translationFilePath = path.resolve(args['t']);
  const translationFile = FileSystemFileAccessNode(translationFilePath);

  const dataWakPath = path.resolve(args['data-wak']);
  let buffer = await nodeFileSystemHelpers.readFileAsBuffer(dataWakPath);
  buffer = Buffer.from(buffer);
  const dataWakParentDirectory = FileSystemDirectoryAccessDataWakMemory(buffer);

  const dataWakResult = await scrapeDataWak({
    translationFile: translationFile,
    dataWakParentDirectory: dataWakParentDirectory,
  });

  const errors = Object.values(dataWakResult).filter((v) => v.error);
  if (errors.length > 0) {
    console.error('Error happened during scraping data wak content:', errors);
    console.error('Aborting!');
    return;
  }

  const dataWak = scrapeUtils.convertScrapeResultsToDataWak(dataWakResult);

  // write data wak to file
  {
    const outputMain = path.resolve(args['o-wak']);
    const jsonMain = JSON.stringify(dataWak);

    fs.writeFileSync(outputMain, jsonMain);
  }

  // extract media information

  const perks: StringKeyDictionary<NoitaScrapedMedia[]> = {};
  await appendBase64ImagesToMedia(dataWakResult.perks.data, perks);

  const spells: StringKeyDictionary<NoitaScrapedMedia[]> = {};
  await appendBase64ImagesToMedia(dataWakResult.spells.data, spells);

  const enemies = convertScrapedMediaToArray(dataWakResult.enemyMedia.data);
  await appendBase64ImagesToMedia(dataWakResult.enemies.data, enemies);

  const orbs = convertScrapedMediaToArray(dataWakResult.orbGifs.data);

  // write media to file
  {
    const outputMedia = path.resolve(args['o-media']);
    const jsonMedia = JSON.stringify({
      perks: perks,
      spells: spells,
      enemies: enemies,
      orbs: orbs,
    });

    fs.writeFileSync(outputMedia, jsonMedia);
  }
}

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
