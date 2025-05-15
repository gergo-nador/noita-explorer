import {
  FileSystemFileAccess,
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { NoitaConstants, NoitaSession } from '@noita-explorer/model-noita';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { mathHelpers } from '@noita-explorer/tools';
import { noitaPaths } from '../../../noita-paths.ts';

export const scrapeSessions = async ({
  save00DirectoryApi,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
}): Promise<NoitaSession[]> => {
  const sessionsDirPath = await save00DirectoryApi.path.join(
    noitaPaths.save00.sessions,
  );

  const sessionsDir = await save00DirectoryApi.getDirectory(sessionsDirPath);
  const files = await sessionsDir.listFiles();

  const sessionGroups: StringKeyDictionary<{
    baseId: string;
    stats: FileSystemFileAccess | undefined;
    kills: FileSystemFileAccess | undefined;
  }> = {};

  files.forEach((f) => {
    const fileNameWithoutExtension = f.getNameWithoutExtension();
    // Remove '_stats' or '_kills' postfix if present
    const baseId = fileNameWithoutExtension.replace(/(_stats|_kills)$/, '');

    if (!(baseId in sessionGroups)) {
      sessionGroups[baseId] = {
        baseId: baseId,
        kills: undefined,
        stats: undefined,
      };
    }

    if (fileNameWithoutExtension.endsWith('_stats')) {
      sessionGroups[baseId].stats = f;
    } else if (fileNameWithoutExtension.endsWith('_kills')) {
      sessionGroups[baseId].kills = f;
    }
  });

  const sessions: NoitaSession[] = [];

  for (const baseId in sessionGroups) {
    const sessionObj = sessionGroups[baseId];
    if (sessionObj.stats === undefined) {
      continue;
    }

    const sessionText = await sessionObj.stats.read.asText();
    const sessionXmlObj = await parseXml(sessionText);
    const sessionXml = XmlWrapper(sessionXmlObj);

    const stats = sessionXml.findNthTag('Stats');
    if (stats === undefined) {
      continue;
    }

    const innerStats = stats.findNthTag('stats');
    if (innerStats === undefined) {
      continue;
    }

    const session: NoitaSession = {
      id: baseId,
      buildName: stats.getAttribute('BUILD_NAME')?.asText() ?? 'No Build Name',
      seed: innerStats.getAttribute('world_seed')?.asInt() ?? 0,
      playTime: innerStats.getAttribute('playtime')?.asFloat() ?? -1,
      startedAt: parseDate(baseId),

      dead: innerStats.getAttribute('dead')?.asBoolean() ?? false,
      deathPosX: innerStats.getAttribute('death_pos.x')?.asFloat() ?? 0,
      deathPosY: innerStats.getAttribute('death_pos.y')?.asFloat() ?? 0,
      damageTaken: innerStats.getAttribute('damage_taken')?.asFloat() ?? 0,
      enemiesKilled: innerStats.getAttribute('enemies_killed')?.asInt() ?? 0,
      killedByEntity: undefined,
      killedByReason: undefined,

      gold: innerStats.getAttribute('gold')?.asInt() ?? 0,
      goldAll: innerStats.getAttribute('gold_all')?.asInt() ?? 0,
      goldInfinite:
        innerStats.getAttribute('gold_infinite')?.asBoolean() ?? false,
    };

    session.damageTaken *= mathHelpers.round(
      session.damageTaken * NoitaConstants.hpMultiplier,
      2,
    );

    const killedBy = innerStats.getAttribute('killed_by')?.asText();
    if (killedBy !== undefined) {
      const killedBySplit = killedBy.split(' | ');
      if (killedBySplit.length === 2) {
        session.killedByEntity = killedBySplit[0];
        session.killedByReason = killedBySplit[1];
      }
    }

    sessions.push(session);
  }

  sessions.sort((s1, s2) => s1.id.localeCompare(s2.id));

  return sessions;
};

function parseDate(input: string): Date {
  const year = parseInt(input.slice(0, 4), 10);
  const month = parseInt(input.slice(4, 6), 10) - 1; // Months are 0-based in JavaScript/TypeScript
  const day = parseInt(input.slice(6, 8), 10);
  const hours = parseInt(input.slice(9, 11), 10);
  const minutes = parseInt(input.slice(11, 13), 10);
  const seconds = parseInt(input.slice(13, 15), 10);

  return new Date(year, month, day, hours, minutes, seconds);
}
