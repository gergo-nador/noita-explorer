import { NoitaMaterialReactionComponent } from '@noita-explorer/model-noita';

export type MaterialReactionProcessed = NoitaMaterialReactionComponent & {
  parsed: ParsedReactionType;
  overrideComponentId?: string;
};

export type ParsedReactionType =
  | { type: 'material-id'; id: string }
  | { type: 'material-tag'; tag: string; extension: string | undefined };
