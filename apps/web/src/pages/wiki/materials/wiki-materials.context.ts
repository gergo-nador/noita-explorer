import { createContext } from 'react';
import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaMaterial } from '@noita-explorer/model-noita';

export interface WikiMaterialsContextState {
  materialsLookup: StringKeyDictionary<NoitaMaterial>;
}

export const WikiMaterialsContext = createContext<WikiMaterialsContextState>({
  materialsLookup: {},
});
