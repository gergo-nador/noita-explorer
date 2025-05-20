import { Flex } from '../../components/flex.tsx';
import { MultiSelection } from '../../components/multi-selection/multi-selection.tsx';
import { useSettingsStore } from '../../stores/settings.ts';
import { Header } from '@noita-explorer/noita-component-library';

export const SettingsExtras = () => {
  const { settings, set } = useSettingsStore();
  const { progressDisplayDebugData } = settings;

  return (
    <Header title={'Extras'}>
      <Flex style={{ width: 'max-content' }} gap={20}>
        <span>Display Debug Info: </span>
        <MultiSelection<boolean>
          options={[
            {
              id: 'no',
              display: 'No',
              value: false,
            },
            {
              id: 'yes',
              display: 'Yes',
              value: true,
            },
          ]}
          setValue={(value) => set((s) => (s.progressDisplayDebugData = value))}
          currentValue={progressDisplayDebugData}
        />
      </Flex>
    </Header>
  );
};
