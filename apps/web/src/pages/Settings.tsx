/*
import { Header, PathInput, Button } from '../noita-component-library';
import { useSettingsStore } from '../stores/settings';
import { PlatformR } from '../utils/PlatformR';
import { noitaAPI } from '../ipcHandlers';
import { useEffect } from 'react';

export const Settings = () => {
  const { paths, set, load, loaded } = useSettingsStore();

  useEffect(() => {
    if (!loaded) {
      load();
    }
  }, [loaded]);

  const autoFill = () => {
    PlatformR.select({
      windows: async () => {
        const installPath =
          await noitaAPI.noita.defaultPaths.windows.installPathDefault();
        const nollaGamesNoita =
          await noitaAPI.noita.defaultPaths.windows.nollaGamesNoitaDefault();

        const newPaths = {
          ...paths,
          install: paths.install ?? installPath,
          NollaGamesNoita: paths.NollaGamesNoita ?? nollaGamesNoita,
        };

        if (newPaths.install) {
          const commonCsv = await noitaAPI.path.join([
            newPaths.install,
            'data',
            'translations',
            'common.csv',
          ]);

          if (await noitaAPI.path.exist(commonCsv)) {
            newPaths.commonCsv = commonCsv;
          }
        }

        if (newPaths.NollaGamesNoita) {
          const save00 = await noitaAPI.path.join([
            newPaths.NollaGamesNoita,
            'save00',
          ]);

          if (await noitaAPI.path.exist(save00)) {
            newPaths.save00 = save00;
          }

          const data = await noitaAPI.path.join([
            newPaths.NollaGamesNoita,
            'data',
          ]);

          if (await noitaAPI.path.exist(data)) {
            newPaths.data = data;
          }
        }

        set((state) => (state.paths = newPaths));
      },
      linux: async () => {
        throw new Error('Needs to be implemented');
      },
      macOs: async () => {
        throw new Error('Needs to be implemented');
      },
    }).catch((err) => console.error(err));
  };

  return (
    <div>
      <Header title={'System Paths'}></Header>
      <hr />
      <Button onClick={autoFill}>Auto Fill</Button>
      <hr />
      <div>
        <PathInput
          type={'directory'}
          displayPath={paths.install ?? 'Select Noita Install Folder...'}
          path={paths.install}
          setPath={(path) => {
            set((state) => (state.paths.install = path));
          }}
        />
      </div>
      <div style={{ display: 'flex' }}>
        <span>└───</span>
        <PathInput
          type={'file'}
          displayPath={
            paths.commonCsv?.startsWith(paths.install)
              ? paths.commonCsv.substring(paths.install.length)
              : (paths.commonCsv ?? 'Select common.csv...')
          }
          path={paths.commonCsv}
          setPath={(path) => {
            set((state) => (state.paths.commonCsv = path));
          }}
        />
      </div>
      <hr />
      <div>
        <PathInput
          type={'directory'}
          displayPath={
            paths.NollaGamesNoita ?? 'Select Nolla_Games_Noita Folder...'
          }
          path={paths.NollaGamesNoita}
          setPath={(path) => {
            set((state) => (state.paths.NollaGamesNoita = path));
          }}
        />
      </div>
      <div style={{ display: 'flex' }}>
        <span>├───</span>
        <PathInput
          type={'directory'}
          displayPath={
            paths.data?.startsWith(paths.NollaGamesNoita)
              ? paths.data.substring(paths.NollaGamesNoita.length)
              : (paths.data ?? 'Select data folder (extracted data.wak)')
          }
          path={paths.data}
          setPath={(path) => {
            set((state) => (state.paths.data = path));
          }}
        />
      </div>
      <div style={{ display: 'flex' }}>
        <span>└───</span>
        <PathInput
          type={'directory'}
          displayPath={
            paths.save00?.startsWith(paths.NollaGamesNoita)
              ? paths.save00.substring(paths.NollaGamesNoita.length)
              : (paths.save00 ?? 'Select save00 folder...')
          }
          path={paths.save00}
          setPath={(path) => {
            set((state) => (state.paths.save00 = path));
          }}
        />
      </div>
      <hr />
      <div>Or run noita.exe to extract the data.wak</div>
      <hr />
      <br />
      <br />
      <br />
      <div>Display build data the data was processed?</div>
      <div>current branch from _branch.txt</div>
      <div>version hash</div>
      <div>Are data already processed?</div>
      <div>Are enemies ready to be displayed?</div>
      <div>Are spells ready to be displayed?</div>
      <div>Are perks ready to be displayed?</div>
    </div>
  );
};
*/
