import { Flex } from '@noita-explorer/react-utils';
import {
  Header,
  MultiSelection,
} from '@noita-explorer/noita-component-library';
import {
  SettingsCursorType,
  SettingsNoitaCursorType,
  useSettingsStore,
} from '../../stores/settings.ts';
import { imageHelpers, randomHelpers } from '@noita-explorer/tools';
import { useEffect, useState } from 'react';
import { useNoitaDataWakStore } from '../../stores/noita-data-wak.ts';
import { NoitaWandConfig } from '@noita-explorer/model-noita';
import { pages } from '../../routes/pages.ts';
import { Link } from '../../components/link.tsx';

export const SettingsCursor = () => {
  const { settings, set } = useSettingsStore();
  const { cursor } = settings;
  const { data } = useNoitaDataWakStore();

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

  const MultiSelectionCursor = MultiSelection<SettingsCursorType>();
  const MultiSelectionNoitaCursor = MultiSelection<SettingsNoitaCursorType>();

  return (
    <Header title={'Cursor'}>
      <Flex style={{ width: 'max-content' }} gap={20}>
        <span>Type: </span>
        <div>
          <MultiSelectionCursor
            setValue={(value) => set((s) => (s.cursor.type = value))}
            currentValue={cursor.type}
          >
            <MultiSelectionCursor.Item
              value='default'
              style={{ cursor: 'pointer' }}
            >
              Default
            </MultiSelectionCursor.Item>
            <MultiSelectionCursor.Item
              value='noita-cursor'
              style={{
                cursor: 'url(cursors/mouse_cursor_big.png) 20 20, pointer',
              }}
            >
              Noita Cursor
            </MultiSelectionCursor.Item>
            <MultiSelectionCursor.Item
              value='wand'
              style={{ cursor: `url("${customCursor}"), pointer` }}
              onClick={() => setCounter(counter + 1)}
            >
              Wand
            </MultiSelectionCursor.Item>
          </MultiSelectionCursor>
        </div>
      </Flex>

      {cursor.type !== 'default' && <br />}

      {cursor.type === 'noita-cursor' && (
        <Flex style={{ width: 'max-content' }} gap={20}>
          <span>Noita Cursor Type: </span>
          <div>
            <MultiSelectionNoitaCursor
              setValue={(value) => set((s) => (s.cursor.noitaCursor = value))}
              currentValue={cursor.noitaCursor}
            >
              <MultiSelectionNoitaCursor.Item
                value='mouse_cursor_big'
                style={{
                  cursor: 'url(cursors/mouse_cursor_big.png) 20 20, pointer',
                }}
              >
                Medium
              </MultiSelectionNoitaCursor.Item>
              <MultiSelectionNoitaCursor.Item
                value='mouse_cursor_big_system'
                style={{
                  cursor:
                    'url(cursors/mouse_cursor_big_system.png) 25 25, pointer',
                }}
              >
                Large
              </MultiSelectionNoitaCursor.Item>
            </MultiSelectionNoitaCursor>
          </div>
        </Flex>
      )}
      {cursor.type === 'wand' && (
        <div>
          <Link to={pages.settings.cursorWandPicker}>Open Wands</Link>
        </div>
      )}
    </Header>
  );
};
