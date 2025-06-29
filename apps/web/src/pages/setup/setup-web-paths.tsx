import {
  Header,
  Icon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { PathInput } from '../../components/path-input.tsx';
import { useSettingsStore } from '../../stores/settings.ts';
import { useSave00Store } from '../../stores/save00.ts';
import { noitaAPI } from '../../noita-api.ts';
import { Flex } from '@noita-explorer/react-utils';

export const SetupWebPaths = () => {
  const { settings, set: setPaths } = useSettingsStore();
  const { status: save00Status } = useSave00Store();
  const { paths } = settings;

  return (
    <Header title={'Paths'}>
      <div>
        <Flex gap={20}>
          <NoitaTooltipWrapper content={'NollaGamesNoita folder'}>
            <PathInput
              type={'directory'}
              displayPath={
                paths.NollaGamesNoita ?? 'Select the NollaGamesNoita folder'
              }
              dialogTitle={'Select the NollaGamesNoita folder'}
              path={paths.NollaGamesNoita}
              setPath={(path) => {
                setPaths(
                  (state) =>
                    (state.paths = {
                      ...paths,
                      NollaGamesNoita: path,
                      forceReloadNollaGamesNoitaCounter:
                        state.paths.forceReloadNollaGamesNoitaCounter + 1,
                    }),
                );
              }}
              fileSystemDialogId={'nolla_games_noita'}
            />
          </NoitaTooltipWrapper>

          {save00Status !== 'unset' && <div> - </div>}
          {save00Status === 'failed' && (
            <div className={'text-danger'}>Failed to load</div>
          )}
          {save00Status === 'loading' && <div>Loading...</div>}
          {save00Status === 'loaded' && (
            <div className={'text-success'}>Loaded</div>
          )}
        </Flex>

        {noitaAPI.environment.web?.isFileSystemApiUnSupported && (
          <>
            <br />
            <br />
            <Flex align='center'>
              <Icon type={'warning'} size={20} />
              <span>
                This browser is not fully compatible with certain features of
                this site (<i>File System API</i>). As a result, you will need
                to manually set the paths each time you visit. Additionally, you
                will not be able to modify any of your progress.
              </span>
              <Icon type={'warning'} size={20} />
            </Flex>
          </>
        )}
      </div>
    </Header>
  );
};
