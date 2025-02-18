import { Menu, Item, Separator, useContextMenu } from 'react-contexify';

import 'react-contexify/dist/ReactContexify.css';
import { useContextMenuStore } from '../ui-stores/context-menu-store';
import { useEffect } from 'react';

const MENU_ID = 'menu-id';

export const ContextMenuWrapper = () => {
  // 🔥 you can use this hook from everywhere. All you need is the menu id
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  const { menuItems, event } = useContextMenuStore();

  useEffect(() => {
    if (menuItems.length === 0 && event !== undefined) {
      console.error('Menu items has no items');
    }
    if (menuItems.length === 0) {
      return;
    }

    show({
      event: event as unknown as MouseEvent,
    });
  }, [show, event, menuItems]);

  return (
    <div>
      <Menu id={MENU_ID}>
        {menuItems.map((item, i) => {
          if (item.type === 'separator') {
            return <Separator key={i} />;
          }
          if (item.type === 'item') {
            return (
              <Item onClick={item.action} key={item.title}>
                {item.title}
              </Item>
            );
          }
        })}
      </Menu>
    </div>
  );
};
