import * as fs from 'fs';
import { NoitaWakData } from '@noita-explorer/model-noita';
import { Buffer } from 'buffer';
import { promiseHelper } from '@noita-explorer/tools';
import { generateHtmlHead } from './generate-html';

const noitaWakData = readNoitaWakData();
if (noitaWakData) {
  generateStaticAssets(noitaWakData);
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
  return;
  await promiseHelper.fromCallbackProvider((callback) =>
    fs.mkdir('public/perks', callback),
  );

  data.perks.forEach((perk) => {
    const htmlHead = generateHtmlHead({
      siteName: 'Noita Explorer',
      title: perk.name,
      description: perk.description,
      url: '',
      imageUrl: '',
    });
    const buffer = new Buffer(perk.name);
    fs.writeFileSync('public/perks/' + perk.id, buffer);
  });
}
