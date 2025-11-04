import { NoitaMapContainer } from './noita-map-container.tsx';
import { useSave00Store } from '../../stores/save00.ts';
import { useDataWakLoader } from './hooks/use-data-wak-loader.ts';
import 'leaflet-edgebuffer';
import {
  BooleanIcon,
  ProgressBar,
} from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import { useOrganizeBackgroundImages } from './hooks/use-organize-background-images.ts';
import { useDataWakService } from '../../services/data-wak/use-data-wak-service.ts';

export const NoitaMapPage = () => {
  const { data } = useDataWakService();
  const {
    worldPixelScenes,
    streamInfo,
    currentRun,
    status: save00Status,
  } = useSave00Store();

  const {
    isError: isDataWakError,
    progress: dataWakProgress,
    fromCache,
    dataWakBuffer,
  } = useDataWakLoader();

  const { backgrounds, isLoaded: isBackgroundsLoaded } =
    useOrganizeBackgroundImages({ streamInfo, dataWakBuffer });

  if (save00Status === 'unset') {
    return <div>No save00 folder is set</div>;
  }
  if (save00Status === 'failed') {
    return <div className='text-danger'>Failed to load save00</div>;
  }
  if (save00Status === 'loading') {
    return <div>Loading save00...</div>;
  }

  if (!worldPixelScenes || !streamInfo || !currentRun) {
    return <div>No current run detected</div>;
  }

  if (isDataWakError) {
    return <div className='text-danger'>Failed to load assets</div>;
  }

  if (!dataWakBuffer || !isBackgroundsLoaded) {
    return (
      <div>
        {!dataWakBuffer && (
          <Flex>
            <span>Loading assets</span>
            <ProgressBar
              progress={Math.round(
                (100 * dataWakProgress.loaded) / dataWakProgress.total,
              )}
              barColor='healthBar'
            />
          </Flex>
        )}

        {dataWakBuffer && (
          <>
            <Flex>
              <span>
                Assets loaded {fromCache ? 'from cache' : ''}
                <BooleanIcon value={true} />
              </span>
            </Flex>
            <div>
              {isBackgroundsLoaded
                ? 'Backgrounds loaded'
                : 'Loading backgrounds...'}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <NoitaMapContainer
      biomes={data.biomes}
      backgrounds={backgrounds}
      streamInfo={streamInfo}
      worldPixelScenes={worldPixelScenes}
      dataWakBuffer={dataWakBuffer}
    />
  );
};
