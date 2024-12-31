import { Button, Header } from '@noita-explorer/noita-component-library';
import { useSettingsStore } from '../stores/settings.ts';
import { Flex } from '../components/Flex.tsx';

export const Settings = () => {
  const { units, set } = useSettingsStore();
  return (
    <div>
      <Header title={'Units'}>
        <Flex style={{ width: 'max-content' }} gap={20}>
          <span>Time: </span>
          <Flex style={{ width: 'max-content' }} gap={10}>
            <Button
              onClick={() => set((s) => (s.units.time = 'default'))}
              textStyle={{
                color: units.time === 'default' ? 'gold' : undefined,
              }}
            >
              Default
            </Button>
            <span> / </span>
            <Button
              onClick={() => set((s) => (s.units.time = 'frames'))}
              textStyle={{
                color: units.time === 'frames' ? 'gold' : undefined,
              }}
            >
              Frames (f)
            </Button>
            <span> / </span>
            <Button
              onClick={() => set((s) => (s.units.time = 'seconds'))}
              textStyle={{
                color: units.time === 'seconds' ? 'gold' : undefined,
              }}
            >
              Seconds (s)
            </Button>
          </Flex>
        </Flex>
      </Header>
    </div>
  );
};
