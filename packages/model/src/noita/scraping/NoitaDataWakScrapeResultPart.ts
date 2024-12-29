import { NoitaDataWakScrapeResultStatus } from './NoitaDataWakScrapeResultStatus.ts';

export interface NoitaDataWakScrapeResultPart<T> {
  status: NoitaDataWakScrapeResultStatus;
  data?: T;
  error?: unknown;
}
