import { NoitaMapContainer } from './noita-map-container.tsx';
import { useDataWakLoader } from './hooks/use-data-wak-loader.ts';
import 'leaflet-edgebuffer';
import { BooleanIcon } from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import { useOrganizeBackgroundImages } from './hooks/use-organize-background-images.ts';
import { useDataWakService } from '../../services/data-wak/use-data-wak-service.ts';
import { useOrganizeWorldFiles } from './hooks/use-organize-world-files.ts';
import { useSettingsStore } from '../../stores/settings.ts';
import { MapInitialPopup } from './components/map-initial-popup.tsx';
import { useThreadsPool } from './map-renderer-threads/use-threads-pool.ts';
import { DataWakLoader } from './components/loaders/data-wak-loader.tsx';
import { BackgroundsLoader } from './components/loaders/backgrounds-loader.tsx';
import { PetriFilesLoader } from './components/loaders/petri-files-loader.tsx';
import { WorkersLoader } from './components/loaders/workers-loader.tsx';

export const NoitaMapPage = () => {
  const { data } = useDataWakService();
  const { settings } = useSettingsStore();

  const { init: initThreadsPool, isLoaded: isThreadsPoolLoaded } =
    useThreadsPool();
  const {
    isError: isDataWakError,
    progress: dataWakProgress,
    dataWakBuffer,
  } = useDataWakLoader({
    onLoaded: (dataWakBuffer) => initThreadsPool(dataWakBuffer),
  });

  const { backgrounds, isLoaded: isBackgroundsLoaded } =
    useOrganizeBackgroundImages({ dataWakBuffer });
  const { petriFileCollection, mapBounds, chunkInfos } =
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
    !chunkInfos ||
    !isThreadsPoolLoaded
  ) {
    return (
      <Flex column gap={4}>
        <Flex gap={8}>
          <DataWakLoader
            progress={dataWakProgress}
            dataWakBuffer={dataWakBuffer}
          />
        </Flex>

        <Flex gap={8}>
          <BackgroundsLoader
            backgrounds={backgrounds}
            isLoaded={isBackgroundsLoaded}
          />
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
          <PetriFilesLoader petriFileCollection={petriFileCollection} />
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
        <Flex gap={8}>
          <WorkersLoader />
        </Flex>
      </Flex>
    );
  }

  return (
    <NoitaMapContainer
      biomes={data.biomes}
      backgrounds={backgrounds}
      petriFileCollection={petriFileCollection}
      mapBounds={mapBounds}
      chunkInfos={chunkInfos}
    />
  );
};
