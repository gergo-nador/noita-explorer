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
import { useEntityLoader } from './hooks/use-entity-loader.ts';
import { EntitiesLoader } from './components/loaders/entities-loader.tsx';
import { useState } from 'react';

export const NoitaMapPage = () => {
  const { data } = useDataWakService();
  const { settings } = useSettingsStore();
  const [ignoreEntityError, setIgnoreEntityError] = useState(false);

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
    useOrganizeBackgroundImages();
  const { petriFileCollection, mapBounds, chunkInfos } =
    useOrganizeWorldFiles();
  const {
    total: totalEntityFiles,
    processed: processedEntityFiles,
    error: entityError,
    backgroundEntities,
    foregroundEntities,
  } = useEntityLoader();

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
    !isThreadsPoolLoaded ||
    (totalEntityFiles !== processedEntityFiles && !ignoreEntityError)
  ) {
    return (
      <Flex column gap={10}>
        <Flex gap={8} key='data-wak'>
          <DataWakLoader
            progress={dataWakProgress}
            dataWakBuffer={dataWakBuffer}
          />
        </Flex>

        <Flex gap={8} key='backgrounds'>
          <BackgroundsLoader
            backgrounds={backgrounds}
            isLoaded={isBackgroundsLoaded}
          />
        </Flex>

        <Flex gap={8} key='map-bounds'>
          {mapBounds ? (
            <>
              <span>Map bounds loaded</span>
              <BooleanIcon value={true} />
            </>
          ) : (
            <span>Calculating map bounds...</span>
          )}
        </Flex>
        <Flex gap={8} key='petri-files'>
          <PetriFilesLoader petriFileCollection={petriFileCollection} />
        </Flex>
        <Flex gap={8} key='chunk-infos'>
          {chunkInfos ? (
            <>
              <span>Chunk infos loaded</span>
              <BooleanIcon value={true} />
            </>
          ) : (
            <span>Loading chunk infos...</span>
          )}
        </Flex>
        <Flex gap={8} key='workers'>
          <WorkersLoader />
        </Flex>
        <Flex gap={8} key='entities'>
          <EntitiesLoader
            total={totalEntityFiles}
            processed={processedEntityFiles}
            error={entityError}
            onErrorContinueAnyway={() => setIgnoreEntityError(true)}
          />
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
      backgroundEntities={backgroundEntities}
      foregroundEntities={foregroundEntities}
    />
  );
};
