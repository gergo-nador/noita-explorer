import { SettingsUnits } from './SettingsUnits.tsx';
import { SettingsCursor } from './SettingsCursor.tsx';
import { SettingsExtras } from './SettingsExtras.tsx';

export const Settings = () => {
  return (
    <div>
      <SettingsUnits />
      <SettingsCursor />
      <SettingsExtras />
    </div>
  );
};
