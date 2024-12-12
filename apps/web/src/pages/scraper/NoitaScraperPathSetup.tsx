import {
  Button,
  Header,
  NoitaTooltipWrapper,
  useToast,
} from '@noita-explorer/noita-component-library';
import { useSettingsStore } from '../../stores/settings';
import { noitaAPI } from '../../ipcHandlers';
import { useNavigate } from 'react-router-dom';
import { pages } from '../../routes/pages';
import { useEffect, useState } from 'react';
import { PageBottomComponent } from '../../components/PageBottomComponent';
import { PathInput } from '../../components/PathInput.tsx';

export const NoitaScraperPathSetup = () => {
  const { paths, set } = useSettingsStore();
  const navigate = useNavigate();
  const toast = useToast();
  const [nextEnabled, setNextEnabled] = useState(false);

  const autoFill = async () => {
    const installPath = await noitaAPI.noita.defaultPaths.installPathDefault();
    const nollaGamesNoita =
      await noitaAPI.noita.defaultPaths.nollaGamesNoitaDefault();

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
      } else {
        toast.warning('Could not find common.csv file at ' + commonCsv);
      }
    } else {
      toast.warning('Could not find Noita install folder at ' + installPath);
    }

    if (newPaths.NollaGamesNoita) {
      const data = await noitaAPI.path.join([newPaths.NollaGamesNoita, 'data']);

      if (await noitaAPI.path.exist(data)) {
        newPaths.data = data;
      }

      const save00 = await noitaAPI.path.join([
        newPaths.NollaGamesNoita,
        'save00',
      ]);

      if (await noitaAPI.path.exist(save00)) {
        newPaths.save00 = save00;
      }
    } else {
      toast.warning(
        'Could not find NollaGamesNoita folder at ' + nollaGamesNoita,
      );
    }

    toast.info('Autofill completed');

    set((state) => (state.paths = newPaths));
  };

  useEffect(() => {
    if (!paths.install) setNextEnabled(false);
    else if (!paths.commonCsv) setNextEnabled(false);
    else if (!paths.NollaGamesNoita) setNextEnabled(false);
    else setNextEnabled(true);
  }, [paths]);

  return (
    <>
      <Header title={'Step 1: Paths'}>
        <Button onClick={autoFill}>Auto Fill</Button>
        <br />
        <div style={{ display: 'flex' }}>
          <NoitaTooltipWrapper content={'Noita Install Folder'}>
            <PathInput
              type={'directory'}
              displayPath={paths.install ?? 'Select Noita Install Folder...'}
              dialogTitle={'Select Noita Install Folder'}
              path={paths.install}
              setPath={(path) => {
                set((state) => (state.paths.install = path));
              }}
            />
          </NoitaTooltipWrapper>
        </div>

        <div style={{ display: 'flex' }}>
          <span>└───</span>
          <NoitaTooltipWrapper content='common.csv'>
            <PathInput
              type={'file'}
              displayPath={
                paths.commonCsv?.startsWith(paths.install)
                  ? paths.commonCsv.substring(paths.install.length)
                  : (paths.commonCsv ?? 'Select common.csv...')
              }
              dialogTitle={'Select the common.csv file'}
              path={paths.commonCsv}
              setPath={(path) => {
                set((state) => (state.paths.commonCsv = path));
              }}
            />
          </NoitaTooltipWrapper>
        </div>
        <br />
        <div style={{ display: 'flex' }}>
          <NoitaTooltipWrapper content={'NollaGamesNoita folder'}>
            <PathInput
              type={'directory'}
              displayPath={
                paths.NollaGamesNoita ?? 'Select the NollaGamesNoita folder'
              }
              dialogTitle={'Select the NollaGamesNoita folder'}
              path={paths.NollaGamesNoita}
              setPath={(path) => {
                set((state) => (state.paths.NollaGamesNoita = path));
              }}
            />
          </NoitaTooltipWrapper>
        </div>
        <div style={{ display: 'flex' }}>
          <span>├───</span>
          <NoitaTooltipWrapper content={'Extracted data.wak folder'}>
            <PathInput
              type={'directory'}
              displayPath={
                paths.data?.startsWith(paths.NollaGamesNoita)
                  ? paths.data.substring(paths.NollaGamesNoita.length)
                  : (paths.data ??
                    'Select the data folder (extracted data.wak)')
              }
              dialogTitle={'Select the data folder (extracted data.wak)'}
              path={paths.data}
              setPath={(path) => {
                set((state) => (state.paths.data = path));
              }}
            />
          </NoitaTooltipWrapper>
        </div>
        <div style={{ display: 'flex' }}>
          <span>└───</span>
          <NoitaTooltipWrapper content={'save00'}>
            <PathInput
              type={'directory'}
              displayPath={
                paths.save00?.startsWith(paths.NollaGamesNoita)
                  ? paths.save00.substring(paths.NollaGamesNoita.length)
                  : (paths.save00 ?? 'Select the save00 folder')
              }
              dialogTitle={'Select the save00 folder'}
              path={paths.data}
              setPath={(path) => {
                set((state) => (state.paths.data = path));
              }}
            />
          </NoitaTooltipWrapper>
        </div>
      </Header>

      <PageBottomComponent>
        <Button onClick={() => navigate(pages.main)}>Cancel</Button>
        <Button
          disabled={!nextEnabled}
          onClick={() => navigate(pages.setup.scrape)}
        >
          Next
        </Button>
      </PageBottomComponent>
    </>
  );
};
