import { Flex } from '@noita-explorer/react-utils';
import {
  Header,
  MultiSelection,
} from '@noita-explorer/noita-component-library';
import { SettingsUnitsType, useSettingsStore } from '../../stores/settings.ts';

export const SettingsUnits = () => {
  const { settings, set } = useSettingsStore();
  const { units } = settings;

  const MultiSelectionUnits = MultiSelection<SettingsUnitsType>();

  return (
    <Header title={'Units'}>
      <Flex style={{ width: 'max-content' }} gap={20}>
        <span>Time: </span>
        <MultiSelectionUnits
          setValue={(value) => set((s) => (s.units.time = value))}
          currentValue={units.time}
        >
          <MultiSelectionUnits.Item value='default'>
            Default
          </MultiSelectionUnits.Item>
          <MultiSelectionUnits.Item value='frames'>
            Frames
          </MultiSelectionUnits.Item>
          <MultiSelectionUnits.Item value='seconds'>
            Seconds
          </MultiSelectionUnits.Item>
        </MultiSelectionUnits>
      </Flex>
    </Header>
  );
};
