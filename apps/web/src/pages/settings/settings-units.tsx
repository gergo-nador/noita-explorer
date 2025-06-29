import { Flex } from '@noita-explorer/react-utils';
import { Header } from '@noita-explorer/noita-component-library';
import { SettingsUnitsType, useSettingsStore } from '../../stores/settings.ts';
import { MultiSelection } from '../../components/multi-selection/multi-selection.tsx';

export const SettingsUnits = () => {
  const { settings, set } = useSettingsStore();
  const { units } = settings;

  return (
    <Header title={'Units'}>
      <Flex style={{ width: 'max-content' }} gap={20}>
        <span>Time: </span>
        <MultiSelection<SettingsUnitsType>
          options={[
            {
              id: 'Default',
              display: 'Default',
              value: 'default',
            },
            {
              id: 'Frames',
              display: 'Frames',
              value: 'frames',
            },
            {
              id: 'Seconds',
              display: 'Seconds',
              value: 'seconds',
            },
          ]}
          setValue={(value) => set((s) => (s.units.time = value))}
          currentValue={units.time}
        />
      </Flex>
    </Header>
  );
};
