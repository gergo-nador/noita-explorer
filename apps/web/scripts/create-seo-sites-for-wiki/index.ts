import * as fs from 'fs';
import { NoitaWakData } from '@noita-explorer/model-noita';
import { Buffer } from 'buffer';
import { promiseHelper } from '@noita-explorer/tools';
import { generateHtmlHead } from './generate-html';
import { deployUrls } from '../../src/deployUrls';
import * as dotenv from 'dotenv';
import * as path from 'node:path';
import { generateImage } from './generate-image';

dotenv.config();

// only generate in preview and production
const env = process.env.VITE_ENV;
// if set to "generate", it will ignore the environment
const envOverwrite = process.env.GENERATE_STATIC_SITES === 'generate';

const isPreviewOrProp = env === 'preview' || env === 'production';

if (envOverwrite) {
  console.log('GENERATE_STATIC_SITES found, generating static assets');
} else if (isPreviewOrProp) {
  console.log(`VITE_ENV=${env}, generating static assets`);
} else {
  console.log('Skipping static asset generation');
}

if (envOverwrite || isPreviewOrProp) {
  const noitaWakData = readNoitaWakData();
  if (noitaWakData) {
    generateStaticAssets(noitaWakData);
  }
}

function readNoitaWakData() {
  const noitaWakDataPath = 'public/noita_wak_data.json';

  const noitaWakDataExists = fs.existsSync(noitaWakDataPath);
  if (!noitaWakDataExists) {
    return;
  }

  try {
    const wakDataBuffer = fs.readFileSync(noitaWakDataPath);
    const wakDataString = wakDataBuffer.toString('utf8');
    const wakDataJson: NoitaWakData = JSON.parse(wakDataString);

    return wakDataJson;
  } catch (error) {
    console.error('Error reading or parsing noita_wak_data.json:', error);
    return null;
  }
}

async function generateStaticAssets(data: NoitaWakData) {
  await promiseHelper.fromCallbackProvider((callback) =>
    fs.mkdir('public/g', callback),
  );

  // perks
  const perksFolderPath = 'public/g/perks';
  const perksPublicImagePath = 'g/perks';
  await promiseHelper.fromCallbackProvider((callback) =>
    fs.mkdir(perksFolderPath, callback),
  );

  data.perks.forEach((perk) => {
    const redirectUrl = `/wiki/perks?perk=${perk.id}`;
    const imageWebPath = `${perksPublicImagePath}/${perk.id}.png`;
    const imagePath = `${perksFolderPath}/${perk.id}.png`;
    const imagePathFs = path.resolve(imagePath);

    const width = 1500;
    const height = 1500;

    generateImage({
      base64: perk.imageBase64,
      outputPath: imagePathFs,
      width: width,
      height: height,
    });

    const htmlHead = generateHtmlHead({
      siteName: 'Noita Explorer',
      title: perk.name,
      description: perk.description,
      url: deployUrls.noitaExplorer.production + redirectUrl,
      image: {
        url: imageWebPath,
        mimeType: 'image/png',
        width: width.toString(),
        height: height.toString(),
        alt: perk.name,
      },
    });

    const html = `<!DOCTYPE html>
<html lang="en">
  ${htmlHead}
  <body>
    <script>window.location.replace('${redirectUrl}')</script>
  </body>
</html>`;

    const buffer = Buffer.from(html);
    fs.writeFileSync(`public/g/perks/${perk.id}.html`, buffer);
  });

  console.log('Generated static files successfully.');
}
