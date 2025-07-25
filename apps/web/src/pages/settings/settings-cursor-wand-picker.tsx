import { useSettingsStore } from '../../stores/settings.ts';
import { useNoitaDataWakStore } from '../../stores/noita-data-wak.ts';
import { Button, Card, Icon } from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import { useMemo } from 'react';
import { zIndexManager } from '../../utils/zIndexManager.ts';

export const SettingsCursorWandPicker = () => {
  const { settings, set } = useSettingsStore();
  const { cursor } = settings;
  const { data } = useNoitaDataWakStore();

  const wandConfigs = useMemo(() => {
    if (data?.wandConfigs === undefined || data.wandConfigs.length === 0) {
      return undefined;
    }

    const wandConfigs = [...data.wandConfigs];
    wandConfigs.sort((w1, w2) => {
      return w1.gripY - w2.gripY;
    });

    return wandConfigs;
  }, [data]);

  const isRandom =
    cursor.wandSpriteId === undefined || cursor.wandSpriteId === 'random_wand';
  return (
    <div>
      <Flex gap={10} style={{ alignItems: 'flex-start' }}>
        <Card
          color={isRandom ? 'gold' : 'gray'}
          style={{
            position: isRandom ? 'sticky' : 'initial',
            top: 0,
            bottom: 0,
            zIndex: isRandom
              ? zIndexManager.settingsCursorWandActive
              : 'initial',
          }}
        >
          <Button
            onClick={() => set((s) => (s.cursor.wandSpriteId = 'random_wand'))}
          >
            Random
          </Button>
        </Card>
        {wandConfigs?.map((wandConfig) => {
          const isSelected = cursor.wandSpriteId === wandConfig.spriteId;

          return (
            <Card
              key={wandConfig.spriteId}
              color={isSelected ? 'gold' : 'gray'}
              style={{
                position: isSelected ? 'sticky' : 'initial',
                top: 0,
                bottom: 0,
                zIndex: isSelected
                  ? zIndexManager.settingsCursorWandActive
                  : 'initial',
              }}
            >
              <Icon src={wandConfig.imageBase64} style={{ zoom: 3 }} />
              <Button
                onClick={() =>
                  set((s) => (s.cursor.wandSpriteId = wandConfig.spriteId))
                }
              >
                Use
              </Button>
            </Card>
          );
        })}
      </Flex>
    </div>
  );
};
