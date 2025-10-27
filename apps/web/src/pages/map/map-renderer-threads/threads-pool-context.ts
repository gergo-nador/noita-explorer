import { createContext } from 'react';
// @ts-expect-error threads module is not recognized correctly
import { Pool } from 'threads';
import { MapRenderType } from '../../../workers-web/map/map-render.types.ts';

interface Props {
  pool: Pool<MapRenderType>;
}
export const ThreadsPoolContext = createContext<Props | undefined>(undefined);
