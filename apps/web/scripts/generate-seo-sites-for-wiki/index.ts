import * as fs from 'fs';
import { NoitaWakData } from '@noita-explorer/model-noita';
import { Buffer } from 'buffer';
import { generateHtml } from './generate-html';
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
  const fsPath = 'public/g/wiki';
  const webPath = '/g/wiki';
  fs.mkdirSync(fsPath, { recursive: true });

  // perks
  {
    const perksFolderPath = fsPath + '/perks';
    const perksPublicImagePath = webPath + '/perks';
    fs.mkdirSync(perksFolderPath, { recursive: true });

    for (const perk of data.perks) {
      const redirectUrl = `/wiki/perks?perk=${perk.id}`;
      const imageWebPath = `${perksPublicImagePath}/${perk.id}.png`;
      const imagePath = `${perksFolderPath}/${perk.id}.png`;
      const imagePathFs = path.resolve(imagePath);

      const width = 1500;
      const height = 1500;

      if (!fs.existsSync(imagePathFs)) {
        await generateImage({
          base64: perk.imageBase64,
          outputPath: imagePathFs,
          width: width,
          height: height,
        });
      }

      const html = generateHtml({
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

        redirectUrl: redirectUrl,
      });

      const buffer = Buffer.from(html);
      fs.writeFileSync(`${perksFolderPath}/${perk.id}.html`, buffer);
    }
    console.log('Static assets generated - Perks');
  }

  // spells
  {
    const spellsFolderPath = fsPath + '/spells';
    const spellsPublicImagePath = webPath + '/spells';
    fs.mkdirSync(spellsFolderPath, { recursive: true });

    for (const spell of data.spells) {
      const redirectUrl = `/wiki/spells?spell=${spell.id}`;
      const imageWebPath = `${spellsPublicImagePath}/${spell.id}.png`;
      const imagePath = `${spellsFolderPath}/${spell.id}.png`;
      const imagePathFs = path.resolve(imagePath);

      const width = 1500;
      const height = 1500;

      if (!fs.existsSync(imagePathFs)) {
        await generateImage({
          base64: spell.imageBase64,
          outputPath: imagePathFs,
          width: width,
          height: height,
        });
      }

      const html = generateHtml({
        siteName: 'Noita Explorer',
        title: spell.name,
        description: spell.description,
        url: deployUrls.noitaExplorer.production + redirectUrl,
        image: {
          url: imageWebPath,
          mimeType: 'image/png',
          width: width.toString(),
          height: height.toString(),
          alt: spell.name,
        },

        redirectUrl: redirectUrl,
      });

      const buffer = Buffer.from(html);
      fs.writeFileSync(`${spellsFolderPath}/${spell.id}.html`, buffer);
    }
    console.log('Static assets generated - Spells');
  }

  // enemies
  {
    const enemiesFolderPath = fsPath + '/enemies';
    const enemiesPublicImagePath = webPath + '/enemies';
    fs.mkdirSync(enemiesFolderPath, { recursive: true });

    for (const enemy of data.enemies) {
      const redirectUrl = `/wiki/enemies?enemy=${enemy.id}`;
      const imageWebPath = `${enemiesPublicImagePath}/${enemy.id}.png`;
      const imagePath = `${enemiesFolderPath}/${enemy.id}.png`;
      const imagePathFs = path.resolve(imagePath);

      const width = 1500;
      const height = 1500;

      if (!fs.existsSync(imagePathFs)) {
        await generateImage({
          base64: enemy.imageBase64,
          outputPath: imagePathFs,
          width: width,
          height: height,
        });
      }

      const html = generateHtml({
        siteName: 'Noita Explorer',
        title: enemy.name,
        description: `${enemy.hp}❤️ ${enemy.hasGoldDrop ? enemy.goldDrop : '-'}💰`,
        url: deployUrls.noitaExplorer.production + redirectUrl,
        image: {
          url: imageWebPath,
          mimeType: 'image/png',
          width: width.toString(),
          height: height.toString(),
          alt: enemy.name,
        },

        redirectUrl: redirectUrl,
      });

      const buffer = Buffer.from(html);
      fs.writeFileSync(`${enemiesFolderPath}/${enemy.id}.html`, buffer);
    }
    console.log('Static assets generated - Enemies');
  }
}
