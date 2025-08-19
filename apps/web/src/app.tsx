import {
  ContextMenuWrapper,
  NoitaToaster,
  DialogWrapper,
} from '@noita-explorer/noita-component-library';
import { RouterProvider } from 'react-router-dom';
import { browserRouter } from './routes/router';
import { useSettingsStore } from './stores/settings';
import React, { useEffect } from 'react';
import { useNoitaDataWakStore } from './stores/noita-data-wak.ts';
import { useSave00Store } from './stores/save00.ts';
import { NoitaWandConfig } from '@noita-explorer/model-noita';
import { imageHelpers, randomHelpers } from '@noita-explorer/tools';
import { ActionsPanel } from './components/actions/actions-panel.tsx';
import { initParticlesEngine } from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import { loadEmittersPlugin } from '@tsparticles/plugin-emitters';
import { MobileViewUnsupportedWarning } from './components/mobile-view-unsupported-warning.tsx';

interface Props {
  /**
   * Provide a customer router
   */
  children?: React.ReactNode;
}

export const App = ({ children }: Props) => {
  useInitialLoader();

  return (
    <>
      {children ?? <RouterProvider router={browserRouter} />}

      <DialogWrapper />
      <ContextMenuWrapper />
      <NoitaToaster />
      <ActionsPanel />
      <MobileViewUnsupportedWarning />
    </>
  );
};

const useInitialLoader = () => {
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

  const { reload } = useSave00Store();

  useEffect(() => {
    if (!settings.paths.NollaGamesNoita) {
      return;
    }

    reload()
      .then(() => console.log('save00 loaded'))
      .catch((err) => console.error(err));
  }, [
    reload,
    settings.paths.NollaGamesNoita,
    settings.paths.forceReloadNollaGamesNoitaCounter,
  ]);

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

  useEffect(() => {
    // this should be run only once per application lifetime
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      await loadFull(engine);
      //await loadSlim(engine);
      //await loadBasic(engine);
      await loadEmittersPlugin(engine, false);
    });
  }, []);
};
