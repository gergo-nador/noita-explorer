import * as fs from 'fs';
import * as path from 'path';
import * as process from 'node:process';
import { args } from '../utils/process-args';
import '../utils/dotenv-init';

/**
 * This process downloads the data.wak and the common.csv files
 * from the given urls.
 *
 * Environment variables:
 * - CI_DATA_WAK_URL: url to download data.wak from
 * - CI_TRANSLATIONS_URL: url to download common.csv from
 *
 * Process arguments:
 * - o: output directory
 * - f: if provided, the files will be force downloaded and will override the current version
 */

const outputFolder = args['o'];
const forceDownload = args['f'] !== undefined;

if (!outputFolder) {
  console.error('output folder must be specified with argument -o');
  process.exit(1);
}

fs.mkdirSync(outputFolder, { recursive: true });

const dataWakUrl = process.env.CI_DATA_WAK_URL;
const dataWakPath = path.resolve(outputFolder, 'data.wak');
if (!dataWakUrl) {
  console.error('data.wak url is undefined');
  process.exit(1);
} else if (!fs.existsSync(dataWakPath) || forceDownload) {
  console.log('downloading data.wak ...');
  download(dataWakUrl, dataWakPath);
  console.log(`data.wak successfully downloaded`);
} else {
  console.log('data.wak is already downloaded');
}

const translationsUrl = process.env.CI_TRANSLATIONS_URL;
const translationsPath = path.resolve(outputFolder, 'common.csv');
if (!translationsUrl) {
  console.error('translations url is undefined');
  process.exit(1);
} else if (!fs.existsSync(translationsPath) || forceDownload) {
  console.log('downloading common.csv ...');
  download(translationsUrl, translationsPath);
  console.log(`common.csv successfully downloaded`);
} else {
  console.log('common.csv is already downloaded');
}

function download(url: string, filePath: string) {
  const outputPath = path.resolve(filePath);

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        const errorMessage = `Download failed with error code ${response.status} for url ${url}`;
        throw new Error(errorMessage);
      }

      return response.arrayBuffer();
    })
    .then((arrayBuffer) => {
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(outputPath, buffer);
    })
    .catch((err) => console.error('Error: ', err));
}
