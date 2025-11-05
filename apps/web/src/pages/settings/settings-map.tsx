import {
  Header,
  MultiSelection,
  useToast,
} from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import {
  SettingsMapWorkerAmountType,
  useSettingsStore,
} from '../../stores/settings.ts';

export const SettingsMap = () => {
  const { settings, set } = useSettingsStore();
  const { map } = settings;
  const toast = useToast();

  const MultiSelectionUnits = MultiSelection<SettingsMapWorkerAmountType>();

  return (
    <Header title='Map'>
      <Flex style={{ width: 'max-content' }} gap={20}>
        <span>Amount of workers: </span>
        <MultiSelectionUnits
          setValue={(value) => set((s) => (s.map.workerAmountType = value))}
          currentValue={map.workerAmountType}
        >
          <MultiSelectionUnits.Item value='auto'>Auto</MultiSelectionUnits.Item>
          <MultiSelectionUnits.Item value='custom'>
            Custom
          </MultiSelectionUnits.Item>
        </MultiSelectionUnits>
      </Flex>
      {map.workerAmountType === 'custom' && (
        <Flex style={{ width: 'max-content' }} gap={20}>
          <span>Custom value: </span>
          <input
            type='number'
            min={1}
            value={map.customWorkerCount}
            onInput={(e) => {
              let value = parseInt(e.currentTarget.value);

              if (value < 1) {
                toast.warning('Custom worker count must be greater than 0');
                value = Math.min(value, 1);
              }

              if (value > 100) {
                toast.warning(
                  `Warning: you set the worker count to ${value}. Are you sure about it?`,
                );
              }

              set((s) => (s.map.customWorkerCount = value));
            }}
          />
        </Flex>
      )}
    </Header>
  );
};
