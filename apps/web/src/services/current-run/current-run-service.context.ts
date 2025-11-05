import { createContext } from 'react';
import {
  StreamInfoFileFormat,
  WorldPixelSceneFileFormat,
} from '@noita-explorer/model-noita';
import { Save00CurrentRun } from '../../stores/save00.ts';

interface Props {
  currentRun: Save00CurrentRun;
  streamInfo: StreamInfoFileFormat;
  worldPixelScenes: WorldPixelSceneFileFormat;
}

export const CurrentRunServiceContext = createContext<Props>({} as Props);
