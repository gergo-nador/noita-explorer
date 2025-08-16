import * as fs from 'node:fs';
import { NoitaWakData } from '@noita-explorer/model-noita';

export function readDataWak(): NoitaWakData {
  const wakDataJson = fs.readFileSync('public/noita_wak_data.json').toString();
  const wakData: NoitaWakData = JSON.parse(wakDataJson);
  return wakData;
}

export function writeDataWak(data: NoitaWakData) {
  const json = JSON.stringify(data);
  fs.writeFileSync('public/noita_wak_data.json', json);
}

export function setDataWak(noitaDataWakStore) {
  const wakData = readDataWak();
  noitaDataWakStore.getState().load(wakData);
}
