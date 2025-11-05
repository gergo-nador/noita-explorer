import { SettingsUnits } from './settings-units.tsx';
import { SettingsCursor } from './settings-cursor.tsx';
import { SettingsExtras } from './settings-extras.tsx';
import { SettingsMap } from './settings-map.tsx';

export const Settings = () => {
  return (
    <div>
      <SettingsUnits />
      <SettingsCursor />
      <SettingsMap />
      <SettingsExtras />
    </div>
  );
};
