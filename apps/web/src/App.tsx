import {
  ContextMenuWrapper,
  NoitaToaster,
  DialogWrapper,
} from '@noita-explorer/noita-component-library';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { useSettingsStore } from './stores/settings';
import { useEffect } from 'react';
import { useNoitaDataWakStore } from './stores/NoitaDataWak.ts';
import { noitaAPI } from './ipcHandlers.ts';

export const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <DialogWrapper />
      <ContextMenuWrapper />
      <NoitaToaster />
      <InitialLoader />
    </>
  );
};

const InitialLoader = () => {
  const { load: loadSettings, loaded: settingsLoaded } = useSettingsStore();

  useEffect(() => {
    if (settingsLoaded) return;

    loadSettings()
      .then(() => console.log('Settings Loaded'))
      .catch((err) => console.error('Settings Load error', err));
  }, [settingsLoaded, loadSettings]);

  const {
    exists: noitaDataWakExists,
    load: noitaDataWakSet,
    setExists: noitaDataWakSetExist,
  } = useNoitaDataWakStore();

  const loadNoitaDataWak = async () => {
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

  useEffect(() => {
    if (noitaDataWakExists !== undefined) return;

    loadNoitaDataWak()
      .then(() => console.log('Data Wak loaded'))
      .catch((err) => console.error(err));
  }, [noitaDataWakExists]);

  return <div></div>;
};
