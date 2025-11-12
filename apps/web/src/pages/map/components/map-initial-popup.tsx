import { Button } from '@noita-explorer/noita-component-library';
import { useSettingsStore } from '../../../stores/settings.ts';

export const MapInitialPopup = () => {
  const { set: setSettings } = useSettingsStore();

  return (
    <div style={{ maxWidth: 500 }}>
      <h2>Welcome to the Map (beta)!</h2>
      <div>
        Rendering the map is a <b>memory intensive</b> process. If that's an
        issue, you might want to take a look at Settings tab to reduce the
        amount of parallel workers (this reduces the memory consumption as
        well).
      </div>
      <br />
      <div>
        The Map is still in Beta, we are still fixing issues, improving
        performance, and adding new features.
      </div>
      <br />
      <div>
        The Map does not support:
        <ul>
          <li>New Game+ biomes</li>
          <li>Nightmare biomes</li>
        </ul>
      </div>
      <br />
      <Button
        style={{ textDecoration: 'underline' }}
        onClick={() =>
          setSettings((settings) => (settings.map.initialPopupSeen = true))
        }
      >
        Cool, show me the map!
      </Button>
    </div>
  );
};
