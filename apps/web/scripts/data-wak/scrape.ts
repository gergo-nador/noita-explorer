import { scrapeUtils } from '@noita-explorer/scrapers';
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
import { scrapeMedia } from './scrape-media';
import { NoitaDataWakScrapeResultPart } from '@noita-explorer/model-noita';
import { data } from 'react-router-dom';

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

  const dataWakResult = await scrapeUtils.scrapeDataWak({
    translationFile: translationFile,
    dataWakParentDirectory: dataWakParentDirectory,
  });

  const errors = Object.values(dataWakResult).filter(
    (v: NoitaDataWakScrapeResultPart<unknown>) => v.error,
  );
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
  const media = await scrapeMedia({ dataWakResult, dataWak });

  // write media to file
  {
    const outputMedia = path.resolve(args['o-media']);
    const jsonMedia = JSON.stringify(media);

    fs.writeFileSync(outputMedia, jsonMedia);
  }
}
