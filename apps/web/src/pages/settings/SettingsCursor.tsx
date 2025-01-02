import { Flex } from '../../components/Flex.tsx';
import { Button, Header } from '@noita-explorer/noita-component-library';
import {
  SettingsCursorType,
  SettingsNoitaCursorType,
  useSettingsStore,
} from '../../stores/settings.ts';
import { imageHelpers, randomHelpers } from '@noita-explorer/tools';
import { useEffect, useState } from 'react';
import { useNoitaDataWakStore } from '../../stores/NoitaDataWak.ts';
import { NoitaWandConfig } from '@noita-explorer/model';
import { useNavigate } from 'react-router-dom';
import { pages } from '../../routes/pages.ts';
import { MultiSelection } from '../../components/MultiSelection.tsx';

export const SettingsCursor = () => {
  const { settings, set } = useSettingsStore();
  const { cursor } = settings;
  const { data } = useNoitaDataWakStore();
  const navigate = useNavigate();

  const [customCursor, setCustomCursor] = useState<string>();
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (data?.wandConfigs === undefined || data.wandConfigs.length === 0) {
      return;
    }

    let wandConfig: NoitaWandConfig | undefined;
    if (cursor.wandSpriteId !== undefined) {
      wandConfig = data.wandConfigs.find(
        (w) => w.spriteId === cursor.wandSpriteId,
      );
    }
    // this can be the case if the wand sprite id doesn't exist in the wandConfigs
    if (wandConfig === undefined) {
      wandConfig = randomHelpers.randomPick(data.wandConfigs);
    }

    imageHelpers
      .scaleImageBase64(wandConfig.imageBase64, 4)
      .then((cursor) => imageHelpers.rotateImageBase64(cursor, 225))
      .then(imageHelpers.trimWhitespaceBase64)
      .then(setCustomCursor);
  }, [data?.wandConfigs, cursor.wandSpriteId, counter]);

  return (
    <Header title={'Cursor'}>
      <Flex style={{ width: 'max-content' }} gap={20}>
        <span>Type: </span>
        <div>
          <MultiSelection<SettingsCursorType>
            options={[
              {
                text: 'Default',
                value: 'default',
                style: {
                  cursor: 'pointer',
                },
              },
              {
                text: 'Noita Cursor',
                value: 'noita-cursor',
                style: {
                  cursor: 'url(cursors/mouse_cursor_big.png) 20 20, pointer',
                },
              },
              {
                text: 'Wand',
                value: 'wand',
                style: {
                  cursor: `url("${customCursor}"), pointer`,
                },
                onClick: () => setCounter(counter + 1),
              },
            ]}
            setValue={(value) => set((s) => (s.cursor.type = value))}
            currentValue={cursor.type}
          />
        </div>
      </Flex>

      {cursor.type !== 'default' && <br />}

      {cursor.type === 'noita-cursor' && (
        <Flex style={{ width: 'max-content' }} gap={20}>
          <span>Noita Cursor Type: </span>
          <div>
            <MultiSelection<SettingsNoitaCursorType>
              options={[
                {
                  text: 'Medium',
                  value: 'mouse_cursor_big',
                  style: {
                    cursor: 'url(cursors/mouse_cursor_big.png) 20 20, pointer',
                  },
                },
                {
                  text: ' Large',
                  value: 'mouse_cursor_big_system',
                  style: {
                    cursor:
                      'url(cursors/mouse_cursor_big_system.png) 25 25, pointer',
                  },
                },
              ]}
              setValue={(value) => set((s) => (s.cursor.noitaCursor = value))}
              currentValue={cursor.noitaCursor}
            />
          </div>
        </Flex>
      )}
      {cursor.type === 'wand' && (
        <div>
          <Button onClick={() => navigate(pages.settings.cursorWandPicker)}>
            Open Wands
          </Button>
        </div>
      )}
    </Header>
  );
};
