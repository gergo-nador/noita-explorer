import {
  ContextMenuWrapper,
  NoitaToaster,
  DialogWrapper,
} from '@noita-explorer/noita-component-library';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { useSettingsStore } from './stores/settings';
import { useEffect } from 'react';
import { useNoitaDataWakStore } from './stores/NoitaDataWak.ts';
import { noitaAPI } from './ipcHandlers.ts';
import { useSave00Store } from './stores/save00.ts';
import { NoitaWandConfig } from '@noita-explorer/model-noita';
import { imageHelpers, randomHelpers } from '@noita-explorer/tools';

export const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <DialogWrapper />
      <ContextMenuWrapper />
      <NoitaToaster />
      <InitialLoader />
    </>
  );
};

const InitialLoader = () => {
  const {
    load: loadSettings,
    loaded: settingsLoaded,
    settings,
  } = useSettingsStore();

  useEffect(() => {
    if (settingsLoaded) return;

    loadSettings()
      .then(() => console.log('Settings Loaded'))
      .catch((err) => console.error('Settings Load error', err));
  }, [settingsLoaded, loadSettings]);

  const {
    exists: noitaDataWakExists,
    load: noitaDataWakSet,
    setExists: noitaDataWakSetExist,
  } = useNoitaDataWakStore();

  useEffect(() => {
    if (noitaDataWakExists !== undefined) return;

    const loadNoitaDataWak = async () => {
      const exists = await noitaAPI.noita.dataFile.exists();
      if (exists) {
        noitaDataWakSetExist(true);
      } else {
        noitaDataWakSetExist(false);
        return;
      }

      const data = await noitaAPI.noita.dataFile.get();
      if (data) {
        noitaDataWakSet(data);
      }
    };

    loadNoitaDataWak()
      .then(() => console.log('Data Wak loaded'))
      .catch((err) => console.error(err));
  }, [noitaDataWakExists, noitaDataWakSet, noitaDataWakSetExist]);

  const { reload } = useSave00Store();

  useEffect(() => {
    reload()
      .then(() => console.log('save00 loaded'))
      .catch((err) => console.error(err));
  }, [reload, settings.paths.NollaGamesNoita]);

  const { cursor } = settings;
  const { data } = useNoitaDataWakStore();
  useEffect(() => {
    // Remove any previously added custom cursor styles to prevent duplicates
    let customStyleElement = document.getElementById('custom-cursor-style');
    if (customStyleElement) {
      customStyleElement.remove();
    }

    // Create a new style element
    customStyleElement = document.createElement('style');
    customStyleElement.id = 'custom-cursor-style';
    const cursorApplicableSelector =
      '*:not(.cursor-settings-button, .cursor-settings-button *)';

    // Define the CSS rules
    if (cursor.type === 'default') {
      // just remove the custom-cursor-style
      return;
    } else if (cursor.type === 'noita-cursor') {
      let url = '';

      if (cursor.noitaCursor === 'mouse_cursor_big') {
        // 40 x 40
        url = 'url(cursors/mouse_cursor_big.png) 20 20';
      } else if (cursor.noitaCursor === 'mouse_cursor_big_system') {
        // 51 x 51
        url = 'url(cursors/mouse_cursor_big_system.png) 25 25';
      }

      customStyleElement.innerHTML = `
      ${cursorApplicableSelector} {
        cursor: ${url}, default !important;
      }
      `;
    } else if (cursor.type === 'wand') {
      if (data?.wandConfigs === undefined || data.wandConfigs.length === 0) {
        return;
      }

      let wandConfig: NoitaWandConfig | undefined;
      if (cursor.wandSpriteId !== undefined) {
        wandConfig = data.wandConfigs.find(
          (w) => w.spriteId === cursor.wandSpriteId,
        );
      }
      // this can be the case if the wand sprite id doesn't exist in the wandConfigs
      if (wandConfig === undefined) {
        wandConfig = randomHelpers.randomPick(data.wandConfigs);
      }

      imageHelpers
        .scaleImageBase64(wandConfig.imageBase64, 4)
        .then((cursor) => imageHelpers.rotateImageBase64(cursor, 225))
        .then(imageHelpers.trimWhitespaceBase64)
        .then((cursor) => {
          customStyleElement.innerHTML = `
          ${cursorApplicableSelector} {
            cursor: url("${cursor}"), default !important;
          }
          `;
        });
    }

    // Append the style element to the document head
    document.head.appendChild(customStyleElement);

    // Cleanup when the effect is removed
    return () => {
      customStyleElement.remove();
    };
  }, [data, cursor]);

  return <div></div>;
};

/*

I'll leave this here for further performance improvement optimization
const dataWakScrape = async () => {
    console.log('START READING DATA WAK FILE');

    const db = await noitaDb;
    const config = db.config;

    const nollaGamesNoitaFolder = await config.get(
      'settings.paths.NollaGamesNoita',
    );

    if (nollaGamesNoitaFolder === undefined) {
      throw new Error('NollaGamesNoita folder is not set');
    }

    const fileAccessConfig = db.fileAccess;
    const nollaGamesNoitaBrowserHandle = await fileAccessConfig.get(
      nollaGamesNoitaFolder,
    );
    if (nollaGamesNoitaBrowserHandle?.kind !== 'directory') {
      throw new Error('NollaGamesNoita folder is not a directory');
    }

    const nollaGamesNoitaDir = FileSystemDirectoryAccessBrowserApi(
      nollaGamesNoitaBrowserHandle,
    );

    const translationFile = await nollaGamesNoitaDir.getFile('common.csv');

    const translations = await readTranslations({
      translationFile: translationFile,
    });

    const dataWakFile = await nollaGamesNoitaDir.getFile('data.wak');
    const dataWakBuffer = await dataWakFile.read.asBuffer();

    const buff = Buffer.from(dataWakBuffer);
    console.log(buff.length);

    const dataWakParentDirectory = FileSystemDirectoryAccessDataWakMemory(buff);

    let perks: NoitaPerk[] = [];
    let perkError: unknown | undefined = undefined;
    try {
      perks = await scrapePerks({
        dataWakParentDirectoryApi: dataWakParentDirectory,
        translations: translations,
      });
    } catch (e) {
      perkError = e;
    }

    let spells: NoitaSpell[] = [];
    let spellsError: unknown | undefined = undefined;
    try {
      spells = await scrapeSpells({
        dataWakParentDirectoryApi: dataWakParentDirectory,
        translations: translations,
      });
    } catch (e) {
      spellsError = e;
    }

    let enemies: NoitaEnemy[] = [];
    let enemiesError: unknown | undefined = undefined;
    try {
      enemies = await scrapeEnemies({
        dataWakParentDirectoryApi: dataWakParentDirectory,
        translations: translations,
      });
    } catch (err) {
      enemiesError = err;
    }

    let wandConfigs: NoitaWandConfig[] = [];
    let wandConfigError: unknown | undefined = undefined;
    try {
      wandConfigs = await scrapeWandConfigs({
        dataWakParentDirectoryApi: dataWakParentDirectory,
      });
    } catch (err) {
      wandConfigError = err;
    }

    console.log('DATA WAK FILE READ');
    console.log(perks, perkError);
    console.log(spells, spellsError);
    console.log(enemies, enemiesError);
    console.log(wandConfigs, wandConfigError);
  };

*/
