// @ts-expect-error threads module is installed
import { Pool } from 'threads';
import { MapRenderType } from '../../../workers-web/map/map-render.types.ts';

export type MapRendererWorker = MapRenderType;
export type MapRendererPool = Pool<MapRenderType>;
