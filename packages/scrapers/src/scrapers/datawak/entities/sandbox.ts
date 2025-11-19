import { scrapeEntityMediaFile } from './scrape-entity-media-file.ts';
import {
  FileSystemFileAccessNode,
  FileSystemDirectoryAccessNode,
} from '@noita-explorer/file-systems';

const bossLimbsFile = FileSystemFileAccessNode(
  '/Users/gergo.nador/noita-explorer/noita_data/data/entities/animals/tentacler.xml',
);
const dataWakDir = FileSystemDirectoryAccessNode(
  '/Users/gergo.nador/noita-explorer/noita_data',
);

scrapeEntityMediaFile({
  file: bossLimbsFile,
  dataWakParentDirectoryApi: dataWakDir,
}).then((result) => {
  console.error(result);
});
