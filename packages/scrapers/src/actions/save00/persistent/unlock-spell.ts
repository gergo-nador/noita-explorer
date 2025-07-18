import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { noitaPaths } from '../../../noita-paths.ts';
import { constants } from '../../../constants.ts';
import { cryptoSalakieli } from '../../../scrapers/cryptography/salakieli.ts';
import { encryptedFileKeys } from '../../../scrapers/cryptography/encrypted-file-keys.ts';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { UnlockSpellAction } from '@noita-explorer/model-noita';

export const unlockSpell = async ({
  save00DirectoryApi,
  action,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
  action: UnlockSpellAction;
}) => {
  const spellId = action.payload.spellId.toLowerCase();

  const flagsDirPath = await save00DirectoryApi.path.join(
    noitaPaths.save00.flags,
  );
  const flagsDir = await save00DirectoryApi.getDirectory(flagsDirPath);

  // Step 1: create progress file
  const spellProgressFlagFileName = 'action_' + spellId.toLowerCase();

  const file = await flagsDir.createFile(spellProgressFlagFileName);
  await file.modify.fromText(constants.whyAreYouLookingHere);

  // Step 2: edit salakieli
  const statsDirPath = await save00DirectoryApi.path.join(
    noitaPaths.save00.stats,
  );
  const statsDirectory = await save00DirectoryApi.getDirectory(statsDirPath);

  const statsSalakieliFile = await statsDirectory.getFile('_stats.salakieli');
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
    const actionId = 'action_' + spellId;
    const alreadyExistingEntityTag = entities.find(
      (e) => e.getAttribute('key')?.asText() === actionId,
    );

    if (alreadyExistingEntityTag) {
      const value =
        alreadyExistingEntityTag.getAttribute('value')?.asInt() ?? 0;
      const newValue = value > 0 ? value : 1;

      alreadyExistingEntityTag.setAttribute('value', String(newValue));
    } else {
      const child = keyValueStats.addChild('E');
      child.setAttribute('key', actionId);
      child.setAttribute('value', String(1));
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
