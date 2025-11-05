import { NoitaMapContainer } from './noita-map-container.tsx';
import { useDataWakLoader } from './hooks/use-data-wak-loader.ts';
import 'leaflet-edgebuffer';
import {
  BooleanIcon,
  ProgressBar,
} from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import { useOrganizeBackgroundImages } from './hooks/use-organize-background-images.ts';
import { useDataWakService } from '../../services/data-wak/use-data-wak-service.ts';
import { useOrganizeWorldFiles } from './hooks/use-organize-world-files.ts';
import { useSettingsStore } from '../../stores/settings.ts';
import { MapInitialPopup } from './components/map-initial-popup.tsx';

export const NoitaMapPage = () => {
  const { data } = useDataWakService();
  const { settings } = useSettingsStore();

  const {
    isError: isDataWakError,
    progress: dataWakProgress,
    dataWakBuffer,
  } = useDataWakLoader();

  const { backgrounds, isLoaded: isBackgroundsLoaded } =
    useOrganizeBackgroundImages({ dataWakBuffer });

  const { petriFileCollection, entityFileCollection, mapBounds } =
    useOrganizeWorldFiles();

  if (!settings.map.initialPopupSeen) {
    return <MapInitialPopup />;
  }

  if (isDataWakError) {
    return <div className='text-danger'>Failed to load assets</div>;
  }

  if (!dataWakBuffer || !isBackgroundsLoaded || !mapBounds) {
    return (
      <div>
        <Flex>
          {dataWakBuffer ? (
            <>
              <span>Assets loaded</span>
              <BooleanIcon value={true} />
            </>
          ) : (
            <>
              <span>Loading game assets...</span>
              <ProgressBar
                progress={Math.round(
                  (100 * dataWakProgress.loaded) / dataWakProgress.total,
                )}
                barColor='healthBar'
                width={250}
              />
            </>
          )}
        </Flex>

        <Flex>
          {isBackgroundsLoaded ? (
            <span>Backgrounds loaded</span>
          ) : (
            <span>Loading backgrounds...</span>
          )}
        </Flex>

        <Flex>
          {mapBounds ? (
            <span>Map bounds loaded</span>
          ) : (
            <span>Calculating map bounds...</span>
          )}
        </Flex>
      </div>
    );
  }

  return (
    <NoitaMapContainer
      biomes={data.biomes}
      backgrounds={backgrounds}
      dataWakBuffer={dataWakBuffer}
      petriFileCollection={petriFileCollection}
      entityFileCollection={entityFileCollection}
      mapBounds={mapBounds}
    />
  );
};
