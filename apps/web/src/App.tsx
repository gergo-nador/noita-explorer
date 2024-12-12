import {
  ContextMenuWrapper,
  NoitaToaster,
  DialogWrapper,
} from '@noita-explorer/noita-component-library';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { useSettingsStore } from './stores/settings';
import { useEffect } from 'react';

export const App = () => {
  const { load, loaded } = useSettingsStore();

  useEffect(() => {
    if (!loaded) {
      load()
        .then(() => console.log('Settings Loaded'))
        .catch((err) => console.error('Settings Load error', err));
    }
  }, [loaded]);

  return (
    <>
      <RouterProvider router={router} />
      <DialogWrapper />
      <ContextMenuWrapper />
      <NoitaToaster />
    </>
  );
};
