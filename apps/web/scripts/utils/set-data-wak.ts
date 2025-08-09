import * as fs from 'node:fs';
import { NoitaWakData } from '@noita-explorer/model-noita';

export function setDataWak(noitaDataWakStore) {
  const wakDataJson = fs.readFileSync('public/noita_wak_data.json').toString();
  const wakData: NoitaWakData = JSON.parse(wakDataJson);
  noitaDataWakStore.getState().load(wakData);
}
