import { NoitaDataWakScrapeResultStatus } from './noita-data-wak-scrape-result-status.ts';

export interface NoitaDataWakScrapeResultPart<T> {
  status: NoitaDataWakScrapeResultStatus;
  data?: T;
  error?: unknown;
}
