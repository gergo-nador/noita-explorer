import { Flex } from '../../components/Flex.tsx';
import { Button, Header } from '@noita-explorer/noita-component-library';
import { useSettingsStore } from '../../stores/settings.ts';
import { imageHelpers, randomHelpers } from '@noita-explorer/tools';
import { useEffect, useState } from 'react';
import { useNoitaDataWakStore } from '../../stores/NoitaDataWak.ts';
import { NoitaWandConfig } from '@noita-explorer/model';
import { useNavigate } from 'react-router-dom';
import { pages } from '../../routes/pages.ts';

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
        <Flex style={{ width: 'max-content' }} gap={10}>
          <Button
            onClick={() => set((s) => (s.cursor.type = 'default'))}
            className={'cursor-settings-button'}
            style={{
              cursor: 'pointer',
            }}
            textStyle={{
              color: cursor.type === 'default' ? 'gold' : undefined,
            }}
          >
            Default
          </Button>
          <span> / </span>
          <Button
            onClick={() => set((s) => (s.cursor.type = 'noita-cursor'))}
            className={'cursor-settings-button'}
            style={{
              cursor: 'url(cursors/mouse_cursor_big.png) 20 20, pointer',
            }}
            textStyle={{
              color: cursor.type === 'noita-cursor' ? 'gold' : undefined,
            }}
          >
            Noita Cursor
          </Button>
          <span> / </span>
          <Button
            onClick={() => {
              set((s) => (s.cursor.type = 'wand'));
              setCounter(counter + 1);
            }}
            className={'cursor-settings-button'}
            style={{
              cursor: `url("${customCursor}"), pointer`,
            }}
            textStyle={{
              color: cursor.type === 'wand' ? 'gold' : undefined,
            }}
          >
            Wand
          </Button>
        </Flex>
      </Flex>

      {cursor.type !== 'default' && <br />}

      {cursor.type === 'noita-cursor' && (
        <Flex style={{ width: 'max-content' }} gap={20}>
          <span>Noita Cursor Type: </span>
          <Flex style={{ width: 'max-content' }} gap={10}>
            <Button
              onClick={() =>
                set((s) => (s.cursor.noitaCursor = 'mouse_cursor_big'))
              }
              className={'cursor-settings-button'}
              style={{
                cursor: 'url(cursors/mouse_cursor_big.png) 20 20, pointer',
              }}
              textStyle={{
                color:
                  cursor.noitaCursor === 'mouse_cursor_big'
                    ? 'gold'
                    : undefined,
              }}
            >
              Medium
            </Button>
            <span> / </span>
            <Button
              onClick={() =>
                set((s) => (s.cursor.noitaCursor = 'mouse_cursor_big_system'))
              }
              className={'cursor-settings-button'}
              style={{
                cursor:
                  'url(cursors/mouse_cursor_big_system.png) 25 25, pointer',
              }}
              textStyle={{
                color:
                  cursor.noitaCursor === 'mouse_cursor_big_system'
                    ? 'gold'
                    : undefined,
              }}
            >
              Large
            </Button>
          </Flex>
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
