import { useSettingsStore } from '../stores/settings';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pages } from '../routes/pages';
import { useNoitaDataWakStore } from '../stores/NoitaDataWak';
import { noitaAPI } from '../ipcHandlers';

export const StartupPage = () => {
  const { load: loadSettings, loaded: settingsLoaded } = useSettingsStore();
  const {
    loaded: noitaDataWakLoaded,
    exists: noitaDataWakExists,
    load: noitaDataWakSet,
    setExists: noitaDataWakSetExist,
  } = useNoitaDataWakStore();
  const [settingsLoadError, setSettingsLoadError] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    if (!settingsLoaded) {
      loadSettings().catch((err) => setSettingsLoadError(err));
    }
  }, [settingsLoaded]);

  useEffect(() => {
    const asyncFunc = async () => {
      const exists = await noitaAPI.noita.dataFile.exists();
      if (exists) {
        noitaDataWakSetExist(true);
      } else {
        noitaDataWakSetExist(false);
        return;
      }

      const data = await noitaAPI.noita.dataFile.get();
      if (data) {
        noitaDataWakSet(data);
      }
    };

    asyncFunc()
      .then(() => console.log('cool'))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;
    if (!noitaDataWakLoaded && noitaDataWakExists === undefined) return;

    navigate(pages.main);
  }, [settingsLoaded, noitaDataWakLoaded, noitaDataWakExists]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div>
        {settingsLoaded ? (
          <div>Settings Loaded</div>
        ) : settingsLoadError ? (
          <div className={'text-danger'}>
            Settings Load Error:
            {JSON.stringify(settingsLoadError)}
          </div>
        ) : (
          <div>Loading Settings...</div>
        )}
      </div>
      <div>
        {noitaDataWakLoaded ? (
          <div>Noita Data Wak Loaded</div>
        ) : settingsLoadError ? (
          <div className={'text-danger'}>
            Settings Load Error:
            {JSON.stringify(settingsLoadError)}
          </div>
        ) : (
          <div>Loading Settings...</div>
        )}
      </div>
    </div>
  );
};
