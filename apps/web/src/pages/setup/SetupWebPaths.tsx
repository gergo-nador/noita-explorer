import {
  Header,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { PathInput } from '../../components/PathInput.tsx';
import { useSettingsStore } from '../../stores/settings.ts';

export const SetupWebPaths = () => {
  const { paths, set: setPaths } = useSettingsStore();

  return (
    <Header title={'Paths'}>
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
              setPaths(
                (state) => (state.paths = { ...paths, NollaGamesNoita: path }),
              );
            }}
          />
        </NoitaTooltipWrapper>
      </div>
    </Header>
  );
};
