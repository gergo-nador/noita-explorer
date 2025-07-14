import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
// @ts-expect-error no esModuleInterop error pls, it works
import minimist from 'minimist';
// @ts-expect-error no esModuleInterop error pls, it works
import process from 'node:process';

dotenv.config();

const argv: Record<string, string> = minimist(process.argv.slice(2));
const outputFolder = argv['o'];
const forceDownload = argv['f'] !== undefined;

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
  download(dataWakUrl, dataWakPath);
} else {
  console.log('data.wak is already downloaded');
}

const translationsUrl = process.env.CI_TRANSLATIONS_URL;
const translationsPath = path.resolve(outputFolder, 'common.csv');
if (!translationsUrl) {
  console.error('translations url is undefined');
  process.exit(1);
} else if (!fs.existsSync(translationsPath) || forceDownload) {
  download(translationsUrl, translationsPath);
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
