import css from './mobile-view-unsupported-warning.module.css';
import { Button, Card } from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import { useSettingsStore } from '../stores/settings.ts';
import { ZIndexManager } from '../utils/z-index-manager.ts';

export const MobileViewUnsupportedWarning = () => {
  const { loaded, settings, set } = useSettingsStore();

  return (
    loaded &&
    !settings.noMobileSupportAccepted && (
      <div
        className={css['container']}
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          zIndex: ZIndexManager.mobileUnsupportedViewDialog,
        }}
      >
        <Flex justify='center' style={{ padding: 10 }}>
          <Card>
            <h2 style={{ lineHeight: 1.2 }}>No Mobile Support :(</h2>
            <div>
              We are sorry, but this page is not optimised for mobile devices.
            </div>
            <div>
              We advise you to visit us on a device with larger screen :D
            </div>
            <br />
            <Flex justify='end'>
              <Button
                onClick={() =>
                  set((settings) => (settings.noMobileSupportAccepted = true))
                }
              >
                Okay, got it!
              </Button>
            </Flex>
          </Card>
        </Flex>
      </div>
    )
  );
};
