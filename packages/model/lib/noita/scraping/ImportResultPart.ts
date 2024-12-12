import { ImportResultStatus } from './ImportResultStatus';

export interface ImportResultPart<T> {
  status: ImportResultStatus;
  data?: T;
  error?: unknown;
}
