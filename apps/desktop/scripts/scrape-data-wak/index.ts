import { FileSystemFileAccessNode } from '../../src/file-system/file-system-file-access-node';
import { scrape, scrapeUtils } from '@noita-explorer/scrapers';
import { scrapeDataWakContent } from '../../src/tools/scrape-data-wak';
import { FileSystemDirectoryAccessNode } from '../../src/file-system/file-system-directory-access-node';
import fs from 'fs';
import path from 'path';

/**
 * Arguments:
 *  -t: path for translation file
 *  --data-f: path for data.wak extracted into a folder (parent folder)
 *  -o: output path
 */

const argv: Record<string, string> = require('minimist')(process.argv.slice(2));

runScrape(argv);

async function runScrape(args: Record<string, string>) {
  let requiredArgumentMissing = false;

  if (!('t' in args)) {
    console.log(
      'Translation file path is missing from the arguments. Use the -t path/file.csv to provide the translation file path',
    );
    requiredArgumentMissing = true;
  } else {
    args.t = path.resolve(args.t);
  }

  // this is an array if later we want to extend this to other file system scrapers (e.g. folder, .zip, .wak)
  const scrapeArguments = ['data-f'];
  const dataArgs = scrapeArguments.find((arg) => arg in args);
  if (!dataArgs) {
    console.log(`Main data is missing. 
    - [Folder] Use --data-f argument to provide the extracted data.wak file`);
    requiredArgumentMissing = true;
  } else {
    args[dataArgs] = path.resolve(args[dataArgs]);
  }

  if (requiredArgumentMissing) {
    process.exit(1);
  }

  const translationFile = FileSystemFileAccessNode(args.t);
  const translations = await scrape.translations({
    translationFile: translationFile,
  });

  const dataWakDir = FileSystemDirectoryAccessNode(args['data-f']);

  const dataWakResult = await scrapeDataWakContent({
    translations,
    dataWakParentDirectory: dataWakDir,
  });

  const dataWak = scrapeUtils.convertScrapeResultsToDataWak(dataWakResult);

  const json = JSON.stringify(dataWak);
  const output = path.resolve(args['o'] ?? 'noita_data_wak.json');

  fs.writeFileSync(output, json);
}
