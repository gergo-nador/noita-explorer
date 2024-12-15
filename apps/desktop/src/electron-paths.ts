import { app } from 'electron';

export const electronPaths = {
  appData: app.getPath('userData'),
};
