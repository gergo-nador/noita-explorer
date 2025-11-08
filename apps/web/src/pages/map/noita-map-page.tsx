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
  const { petriFileCollection, entityFileCollection, mapBounds, chunkInfos } =
    useOrganizeWorldFiles();

  if (!settings.map.initialPopupSeen) {
    return <MapInitialPopup />;
  }

  if (isDataWakError) {
    return <div className='text-danger'>Failed to load assets</div>;
  }

  if (
    !dataWakBuffer ||
    !isBackgroundsLoaded ||
    !mapBounds ||
    !petriFileCollection ||
    !chunkInfos
  ) {
    return (
      <Flex column gap={4}>
        <Flex gap={8}>
          {dataWakBuffer ? (
            <>
              <span>Assets loaded</span>
              <BooleanIcon value={true} />
            </>
          ) : (
            <Flex gap={10}>
              <span>Loading game assets...</span>
              {dataWakProgress !== undefined && (
                <ProgressBar
                  progress={dataWakProgress}
                  barColor='healthBar'
                  width={250}
                />
              )}
            </Flex>
          )}
        </Flex>

        <Flex gap={8}>
          {isBackgroundsLoaded ? (
            <>
              <span>Backgrounds loaded</span>
              <BooleanIcon value={true} />
            </>
          ) : (
            <span>Loading backgrounds...</span>
          )}
        </Flex>

        <Flex gap={8}>
          {mapBounds ? (
            <>
              <span>Map bounds loaded</span>
              <BooleanIcon value={true} />
            </>
          ) : (
            <span>Calculating map bounds...</span>
          )}
        </Flex>
        <Flex gap={8}>
          {petriFileCollection ? (
            <>
              <span>Petri files loaded</span>
              <BooleanIcon value={true} />
            </>
          ) : (
            <span>Loading petri files...</span>
          )}
        </Flex>
        <Flex gap={8}>
          {chunkInfos ? (
            <>
              <span>Chunk infos loaded</span>
              <BooleanIcon value={true} />
            </>
          ) : (
            <span>Loading chunk infos...</span>
          )}
        </Flex>
      </Flex>
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
      chunkInfos={chunkInfos}
    />
  );
};
