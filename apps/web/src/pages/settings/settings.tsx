import { SettingsUnits } from './settings-units.tsx';
import { SettingsCursor } from './settings-cursor.tsx';
import { SettingsExtras } from './settings-extras.tsx';

export const Settings = () => {
  return (
    <div>
      <SettingsUnits />
      <SettingsCursor />
      <SettingsExtras />
    </div>
  );
};
