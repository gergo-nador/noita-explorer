import {
  encryptedFileKeys,
  EnemyStatistic,
  FileSystemFolderBrowserApi,
  noitaPaths,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { aesBuffer, parseXml, XmlWrapper } from '@noita-explorer/tools';

export const scrapeEnemyStatistics = async ({
  save00BrowserApi,
}: {
  save00BrowserApi: FileSystemFolderBrowserApi;
}) => {
  const enemyStatsFolderPath = await save00BrowserApi.path.join(
    noitaPaths.save00.stats,
  );
  const enemyStatsFolder =
    await save00BrowserApi.getFolder(enemyStatsFolderPath);

  const files = await enemyStatsFolder.listFilesFromFolder();
  const animalStatisticsFiles = files
    .filter(
      (f) => f.getName().startsWith('stats_') && f.getName().endsWith('.xml'),
    )
    .map((f) => {
      const animalId = f.getNameWithoutExtension().substring('stats_'.length);

      return {
        file: f,
        animalId: animalId,
      };
    });

  const dict: StringKeyDictionary<EnemyStatistic> = {};

  for (const animalFile of animalStatisticsFiles) {
    const xmlText = await animalFile.file.read.asText();
    const xmlObj = await parseXml(xmlText);
    const xml = XmlWrapper(xmlObj);
    const stats = xml.findNthTag('Stats');

    dict[animalFile.animalId] = {
      id: animalFile.animalId,
      enemyDeathByPlayer: 0,
      playerDeathByEnemy: stats?.getAttribute('player_kills')?.asInt() ?? 0,
    };
  }

  const statsSalakieli = await enemyStatsFolder.getFile('_stats.salakieli');
  const statsSalakieliBuffer = await statsSalakieli.read.asBuffer();
  const decryptedStats = await aesBuffer({
    buffer: statsSalakieliBuffer,
    key: encryptedFileKeys.stats_salakieli.key,
    iv: encryptedFileKeys.stats_salakieli.iv,
  });

  const xmlObj = await parseXml(decryptedStats);
  const xml = XmlWrapper(xmlObj);
  const keyValueStats = xml.findNthTag('KEY_VALUE_STATS');

  if (keyValueStats) {
    const entities = keyValueStats.findTagArray('E');
    for (const entity of entities) {
      const key = entity.getAttribute('key')?.asText();
      const value = entity.getAttribute('value')?.asInt();

      if (key !== undefined && key in dict && value !== undefined) {
        dict[key].enemyDeathByPlayer = value;
      }
    }
  }

  console.log(dict);
  /*
  <session biomes_visited_with_wands="0" damage_taken="0" dead="1" death_count="0" death_pos.x="-739.29" death_pos.y="4322" enemies_killed="60" gold="969" gold_all="1124" gold_infinite="0" healed="0" heart_containers="0" hp="160" items="14" kicks="0" killed_by="Haulikkohiisi's projectile" killed_by_extra="" places_visited="5" playtime="1005.4" playtime_str="0:16:45" projectiles_shot="0" streaks="0" teleports="0" wands_edited="0" world_seed="1619695370" >
  </session>
  <highest biomes_visited_with_wands="0" damage_taken="0" dead="0" death_count="0" death_pos.x="5862.11" death_pos.y="16915.3" enemies_killed="14126" gold="1508961" gold_all="0" gold_infinite="1" healed="0" heart_containers="0" hp="23247525000000000" items="783" kicks="0" killed_by="" killed_by_extra="" places_visited="98" playtime="6228.47" playtime_str="1:43:48" projectiles_shot="0" streaks="1" teleports="0" wands_edited="0" world_seed="0" >
  </highest>
  <global biomes_visited_with_wands="0" damage_taken="0" dead="0" death_count="576" death_pos.x="0" death_pos.y="0" enemies_killed="76350" gold="4296963011" gold_all="0" gold_infinite="0" healed="0" heart_containers="0" hp="23247560144506905" items="7229" kicks="0" killed_by="" killed_by_extra="" places_visited="1947" playtime="912634" playtime_str="253:30:34" projectiles_shot="0" streaks="0" teleports="0" wands_edited="0" world_seed="0" >
  </global>
  <prev_best biomes_visited_with_wands="0" damage_taken="0" dead="0" death_count="0" death_pos.x="5862.11" death_pos.y="16915.3" enemies_killed="14126" gold="1508961" gold_all="0" gold_infinite="1" healed="0" heart_containers="0" hp="23247525000000000" items="783" kicks="0" killed_by="" killed_by_extra="" places_visited="98" playtime="6228.47" playtime_str="1:43:48" projectiles_shot="0" streaks="1" teleports="0" wands_edited="0" world_seed="0" >
  </prev_best>
  * */

  return dict;
};
