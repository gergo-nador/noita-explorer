import {
  Button,
  Header,
  NoitaTooltipWrapper,
  useToast,
} from '@noita-explorer/noita-component-library';
import { useSettingsStore } from '../../stores/settings';
import { noitaAPI } from '../../noita-api.ts';
import { useNavigate } from 'react-router-dom';
import { pages } from '../../routes/pages';
import { useEffect, useState } from 'react';
import { PageBottomComponent } from '../../components/page-bottom-component.tsx';
import { PathInput } from '../../components/path-input.tsx';
import { Flex } from '@noita-explorer/react-utils';

export const SetupDesktopPaths = () => {
  const { settings, set: setPaths } = useSettingsStore();
  const { paths } = settings;
  const navigate = useNavigate();
  const toast = useToast();
  const [nextEnabled, setNextEnabled] = useState(false);

  const [defaultPaths, setDefaultPaths] = useState<{
    install: string | undefined;
    NollaGamesNoita: string | undefined;
  }>({
    install: undefined,
    NollaGamesNoita: undefined,
  });

  useEffect(() => {
    Promise.all([
      noitaAPI.noita.defaultPaths.installPathDefault(),
      noitaAPI.noita.defaultPaths.nollaGamesNoitaDefault(),
    ])
      .then((result) => {
        setDefaultPaths({
          ...defaultPaths,
          install: result[0],
          NollaGamesNoita: result[1],
        });
      })
      .catch((err) =>
        console.error('Error while settings default paths: ', err),
      );
  }, [setDefaultPaths, defaultPaths]);

  const autoFill = async () => {
    const newPaths = {
      ...paths,
      install: paths.install ?? defaultPaths.install,
      NollaGamesNoita: paths.NollaGamesNoita ?? defaultPaths.NollaGamesNoita,
    };

    toast.info('Autofill completed');

    setPaths((state) => (state.paths = newPaths));
  };

  useEffect(() => {
    if (!paths.install) setNextEnabled(false);
    else if (!paths.NollaGamesNoita) setNextEnabled(false);
    else setNextEnabled(true);
  }, [paths]);

  return (
    <>
      <Header title={'Step 1: Paths'}>
        <Flex>
          <NoitaTooltipWrapper content={'Noita Install Folder'}>
            <PathInput
              type={'directory'}
              displayPath={paths.install ?? 'Select Noita Install Folder...'}
              startInIfPathEmpty={defaultPaths.install}
              dialogTitle={'Select Noita Install Folder'}
              path={paths.install}
              setPath={(path) => {
                setPaths(
                  (state) => (state.paths = { ...paths, install: path }),
                );
              }}
            />
          </NoitaTooltipWrapper>
        </Flex>
        <Flex>
          <NoitaTooltipWrapper content={'NollaGamesNoita folder'}>
            <PathInput
              type={'directory'}
              displayPath={
                paths.NollaGamesNoita ?? 'Select the NollaGamesNoita folder'
              }
              startInIfPathEmpty={defaultPaths.NollaGamesNoita}
              dialogTitle={'Select the NollaGamesNoita folder'}
              path={paths.NollaGamesNoita}
              setPath={(path) => {
                setPaths(
                  (state) =>
                    (state.paths = { ...paths, NollaGamesNoita: path }),
                );
              }}
            />
          </NoitaTooltipWrapper>
        </Flex>
      </Header>

      <PageBottomComponent>
        <div></div>
        <Flex gap={20}>
          <Button onClick={() => autoFill()}>Auto fill</Button>
          <Button
            disabled={!nextEnabled}
            onClick={() => navigate(pages.setup.desktopScrape)}
          >
            Next
          </Button>
        </Flex>
      </PageBottomComponent>
    </>
  );
};
