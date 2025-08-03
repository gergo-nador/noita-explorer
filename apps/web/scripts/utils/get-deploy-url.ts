import * as dotenv from 'dotenv';
import { deployUrls } from '../../src/utils/deploy-urls';
dotenv.config();

export const getDeployUrl = () => {
  const env = process.env.VITE_ENV;

  if (env === 'preview') {
    return deployUrls.noitaExplorer.preview;
  }
  return deployUrls.noitaExplorer.production;
};
