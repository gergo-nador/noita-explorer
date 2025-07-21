import { FileSystemDirectoryAccessNode } from '@noita-explorer/file-systems';
import { mergeXmlBaseFiles } from './datawak/scrape-enemies/merge-xml-base-files.ts';
import { diffChars } from 'diff';

const folder = FileSystemDirectoryAccessNode(
  '/Users/gergo.nador/noita-explorer/noita_data',
);
const paths = [
  'data/entities/base_enemy_flying.xml',
  'data/entities/animals/scavenger_grenade.xml',
];

async function getXml(path: string) {
  const file = await folder.getFile(path);
  const merged = await mergeXmlBaseFiles({
    file: file,
    dataWakParentDirectoryApi: folder,
  });

  return merged.xml.toXmlString();
}

async function diffText(text1: string, text2: string) {
  const diff = diffChars(text1, text2);
  const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m', // Removed
    green: '\x1b[32m', // Added
    gray: '\x1b[90m', // Unchanged
  };

  diff.forEach((part) => {
    if (part.added) {
      process.stdout.write(colors.green + part.value + colors.reset);
    } else if (part.removed) {
      process.stdout.write(colors.red + part.value + colors.reset);
    } else {
      process.stdout.write(colors.gray + part.value + colors.reset);
    }
  });
}

async function sandbox() {
  for (let i = 0; i < paths.length; i++) {
    if (paths[i + 1] === undefined) break;

    const from = await getXml(paths[i]);
    const to = await getXml(paths[i + 1]);

    console.log();
    console.log();
    console.log('---------------------------------------------------');
    console.log(`${paths[i]} -> ${paths[i + 1]}`);
    console.log('---------------------------------------------------');
    await diffText(from, to);
  }
}

sandbox();
