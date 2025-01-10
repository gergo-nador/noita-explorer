import { NoitaAPI } from '@noita-explorer/model-noita';
import { browserNoitaApi } from './utils/browserNoitaApi.ts';

export const noitaAPI: NoitaAPI =
  'noitaApi' in window ? (window.noitaApi as NoitaAPI) : browserNoitaApi();
