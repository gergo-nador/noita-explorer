import {
  FileSystemFile,
  FileSystemFolderBrowserApi,
  noitaPaths,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { NoitaSession } from '@noita-explorer/model';
import { parseXml, XmlWrapper } from '@noita-explorer/tools';

export const scrapeSessions = async ({
  save00BrowserApi,
}: {
  save00BrowserApi: FileSystemFolderBrowserApi;
}): Promise<NoitaSession[]> => {
  const sessionsFolderPath = await save00BrowserApi.path.join(
    noitaPaths.save00.sessions,
  );

  const sessionsFolder = await save00BrowserApi.getFolder(sessionsFolderPath);
  const files = await sessionsFolder.listFilesFromFolder();

  const sessionGroups: StringKeyDictionary<{
    baseId: string;
    stats: FileSystemFile | undefined;
    kills: FileSystemFile | undefined;
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

      dead: innerStats.getAttribute('dead')?.asBoolean() ?? false,
      deathPosX: innerStats.getAttribute('death_pos.x')?.asFloat() ?? 0,
      deathPosY: innerStats.getAttribute('death_pos.y')?.asFloat() ?? 0,
      damageTaken: innerStats.getAttribute('damage_taken')?.asFloat() ?? 0,
      enemiesKilled: innerStats.getAttribute('enemies_killed')?.asInt() ?? 0,
      killedBy: innerStats.getAttribute('killed_by')?.asText(),

      gold: innerStats.getAttribute('gold')?.asInt() ?? 0,
      goldAll: innerStats.getAttribute('gold_all')?.asInt() ?? 0,
      goldInfinite:
        innerStats.getAttribute('gold_infinite')?.asBoolean() ?? false,
    };

    sessions.push(session);
  }

  sessions.sort((s1, s2) => s1.id.localeCompare(s2.id));

  return sessions;
};
