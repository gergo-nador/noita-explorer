import { NoitaWakData } from '@noita-explorer/model-noita';

export async function fetchDataWak() {
  // in case the data structure of the json file changes between deploys,
  // then it force re-fetches the file
  const url = `/noita_wak_data.json?id=${__DEPLOY_ID__}`;
  const noitaDataWak: NoitaWakData = await fetch(url).then((r) => r.json());

  return noitaDataWak;
}
