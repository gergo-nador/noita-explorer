import { scrapeDataWak, scrapeUtils } from '@noita-explorer/scrapers';
import * as fs from 'fs';
import * as path from 'path';
import minimist from 'minimist';
import * as process from 'node:process';
import { Buffer } from 'buffer';
import {
  nodeFileSystemHelpers,
  FileSystemFileAccessNode,
  FileSystemDirectoryAccessDataWakMemory,
} from '@noita-explorer/file-systems';

/**
 * Scrapes the data.wak file.
 *
 * Arguments:
 *  - -t: path for translation file
 *  - --data-wak: path to data.wak file
 *  - --o-wak: output path of the data wak json file
 *  - --o-gif: output path of the gif json file
 */

const argv: Record<string, string> = minimist(process.argv.slice(2));

runScrape(argv);

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

  if (!args['o-gif']) {
    console.log('--o-gif argument must be provided');
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

  const enemyMedia = dataWakResult.enemyMedia.data;
  const orbGifs = dataWakResult.orbGifs.data;

  {
    const outputMain = path.resolve(args['o-wak']);
    const jsonMain = JSON.stringify(dataWak);

    fs.writeFileSync(outputMain, jsonMain);
  }

  {
    const outputGifs = path.resolve(args['o-gif']);
    const jsonGifs = JSON.stringify({
      'enemy-media': enemyMedia,
      'orb-gifs': orbGifs,
    });

    fs.writeFileSync(outputGifs, jsonGifs);
  }
}
