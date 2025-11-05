import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { noitaPaths } from '../../../noita-paths.ts';
import { cryptoSalakieli } from '../../../scrapers/common/cryptography/salakieli.ts';
import { encryptedFileKeys } from '../../../scrapers/common/cryptography/encrypted-file-keys.ts';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { UnlockEnemyAction } from '@noita-explorer/model-noita';

export const unlockEnemy = async ({
  save00DirectoryApi,
  action,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
  action: UnlockEnemyAction;
}) => {
  const killCount = Math.max(action.payload.numberOfTimesEnemyKilled, 1);
  const enemyId = action.payload.enemyId;

  const enemyStatsDirPath = await save00DirectoryApi.path.join(
    noitaPaths.save00.stats,
  );
  const enemyStatsDirectory =
    await save00DirectoryApi.getDirectory(enemyStatsDirPath);

  // First step: create the statistics file for the enemy
  const fileName = `stats_${enemyId}.xml`;
  const enemyStatsFile = await enemyStatsDirectory.createFile(fileName);

  await enemyStatsFile.modify.fromText(`
<Stats deaths="${killCount}" kills="0" player_kills="0" player_projectile_count="0" >
  <death_map>
    <E key="player | $damage_projectile" value="${killCount}" >
    </E>
  </death_map>
  <kill_map>
  </kill_map>
</Stats>
`);

  // Second step: modify the stats.salakieli file accordingly
  const statsSalakieliFile =
    await enemyStatsDirectory.getFile('_stats.salakieli');
  const statsSalakieliBuffer = await statsSalakieliFile.read.asBuffer();
  const decryptedStats = await cryptoSalakieli.decrypt({
    buffer: statsSalakieliBuffer,
    key: encryptedFileKeys.stats_salakieli.key,
    iv: encryptedFileKeys.stats_salakieli.iv,
  });

  const xmlObj = await parseXml(decryptedStats);
  const xml = XmlWrapper(xmlObj);
  const keyValueStats = xml.findNthTag('KEY_VALUE_STATS');

  if (keyValueStats) {
    const entities = keyValueStats.findTagArray('E');
    const alreadyExistingEntityTag = entities.find(
      (e) => e.getAttribute('key')?.asText() === enemyId,
    );

    if (alreadyExistingEntityTag) {
      alreadyExistingEntityTag.setAttribute('value', String(killCount));
    } else {
      const child = keyValueStats.addNewChild('E');
      child.setAttribute('key', enemyId);
      child.setAttribute('value', String(killCount));
    }

    keyValueStats.sortChildrenArray('E', (a, b) => {
      const val1 = a.getAttribute('key')?.asText() ?? '';
      const val2 = b.getAttribute('key')?.asText() ?? '';

      return val1.localeCompare(val2);
    });
  }

  const xmlText = xml.toXmlString();
  const encryptedStats = await cryptoSalakieli.encrypt({
    text: xmlText,
    key: encryptedFileKeys.stats_salakieli.key,
    iv: encryptedFileKeys.stats_salakieli.iv,
  });
  await statsSalakieliFile.modify.fromBuffer(encryptedStats);
};
