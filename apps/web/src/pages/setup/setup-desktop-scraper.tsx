import {
  Button,
  Card,
  Header,
  NoitaTooltipWrapper,
  ProgressIcon,
  useBool,
  useToast,
} from '@noita-explorer/noita-component-library';
import {
  NoitaDataWakScrapeResult,
  NoitaDataWakScrapeResultPart,
  NoitaDataWakScrapeResultStatus,
  NoitaWakData,
} from '@noita-explorer/model-noita';
import { scrapeUtils } from '@noita-explorer/scrapers';
import { PageBottomComponent } from '../../components/page-bottom-component.tsx';
import { Flex } from '@noita-explorer/react-utils';
import { noitaAPI } from '../../utils/noita-api.ts';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pages } from '../../routes/pages';
import { useNoitaDataWakStore } from '../../stores/noita-data-wak.ts';
import { sentry } from '../../utils/sentry.ts';
import { SpaceCharacter } from '../../components/space-character.tsx';
import { Link } from '../../components/link.tsx';

export const SetupDesktopScraper = () => {
  const navigate = useNavigate();
  const [dataWakScrapeResult, setDataWakScrapeResult] =
    useState<NoitaDataWakScrapeResult>();
  const [dataWakScrapeResultError, setDataWakScrapeResultError] =
    useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { load: loadNoitaDataWak } = useNoitaDataWakStore();

  const [isFinishEnabled, setIsFinishEnabled] = useState(false);

  const scrape = async () => {
    setIsLoading(true);
    setDataWakScrapeResultError(undefined);

    try {
      const result = await noitaAPI.noita.dataFile.scrape();
      setDataWakScrapeResult(result);
    } catch (e) {
      setDataWakScrapeResultError(e + '');
      console.log('error in scraping: ', e);
      sentry.captureError(e);
    }

    setIsLoading(false);
  };

  const save = (): Promise<NoitaWakData> => {
    if (!dataWakScrapeResult) {
      toast.error('Scraped data was not found.');
      return new Promise((_resolve, reject) => reject());
    }

    const data = scrapeUtils.convertScrapeResultsToDataWak(dataWakScrapeResult);

    return noitaAPI.noita.dataFile.write(data).then(() => data);
  };

  const finish = () => {
    save()
      .then((data) => loadNoitaDataWak(data))
      .then(() => toast.success('Setup complete'))
      .then(() => navigate(pages.main))
      .catch((err) => {
        toast.error('An error occured while saving the data');
        console.error(err);
      });
  };

  useEffect(() => {
    scrape();
  }, []);

  useEffect(() => {
    if (isLoading || !dataWakScrapeResult) {
      setIsFinishEnabled(false);
      return;
    }

    if (
      dataWakScrapeResult.perks.status !==
        NoitaDataWakScrapeResultStatus.SUCCESS ||
      dataWakScrapeResult.spells.status !==
        NoitaDataWakScrapeResultStatus.SUCCESS ||
      dataWakScrapeResult.enemies.status !==
        NoitaDataWakScrapeResultStatus.SUCCESS
    ) {
      setIsFinishEnabled(false);
      return;
    }

    setIsFinishEnabled(true);
  }, [dataWakScrapeResult, isLoading]);

  return (
    <div>
      <Header title={'Scraper'}>
        {isLoading && <div>Loading...</div>}
        {dataWakScrapeResultError && (
          <div className={'text-danger'}>{dataWakScrapeResultError}</div>
        )}
        <br />
        {dataWakScrapeResult && (
          <Flex style={{ gap: '10px' }}>
            {dataWakScrapeResult.translations.status !==
              NoitaDataWakScrapeResultStatus.SUCCESS && (
              <Card>
                <Header title={'Translation'}>
                  <div>
                    Status:
                    <StatusText
                      status={dataWakScrapeResult.translations.status}
                    />
                  </div>
                  {!!dataWakScrapeResult.translations.error && (
                    <div>
                      Error:
                      <SpaceCharacter />
                      {JSON.stringify(dataWakScrapeResult.translations.error)}
                    </div>
                  )}
                </Header>
              </Card>
            )}

            <NoitaDataWakScrapeResultDisplay
              title={'Perks'}
              result={dataWakScrapeResult.perks}
              dataIconMapper={(perk) => (
                <ProgressIcon
                  key={perk.id}
                  type={'regular'}
                  icon={perk.imageBase64}
                  size={24}
                />
              )}
            />

            <NoitaDataWakScrapeResultDisplay
              title={'Spells'}
              result={dataWakScrapeResult.spells}
              dataIconMapper={(spell) => (
                <ProgressIcon
                  key={spell.id}
                  type={'regular'}
                  icon={spell.imageBase64}
                  size={24}
                />
              )}
            />

            <NoitaDataWakScrapeResultDisplay
              title={'Enemies'}
              result={dataWakScrapeResult.enemies}
              dataIconMapper={(enemy) => (
                <ProgressIcon
                  key={enemy.id}
                  type={'regular'}
                  icon={enemy.imageBase64}
                  size={24}
                />
              )}
            />

            <NoitaDataWakScrapeResultDisplay
              title={'Wands'}
              result={dataWakScrapeResult.wandConfigs}
              dataIconMapper={(wand) => (
                <ProgressIcon
                  key={wand.spriteId}
                  type={'regular'}
                  icon={wand.imageBase64}
                  size={24}
                />
              )}
            />

            <NoitaDataWakScrapeResultDisplay
              title={'Materials'}
              result={dataWakScrapeResult.materials}
              dataIconMapper={(material) => {
                if (material.imageBase64) {
                  return (
                    <ProgressIcon
                      key={material.id}
                      type={'regular'}
                      icon={material.imageBase64}
                      size={24}
                    />
                  );
                }
                if (material.graphicsColor) {
                  return (
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        background: material.graphicsColor,
                      }}
                    ></div>
                  );
                }

                return <div></div>;
              }}
            />
          </Flex>
        )}
      </Header>
      <PageBottomComponent>
        <Flex gap={10}>
          <Link to={pages.setup.desktopPaths}>Back</Link>
        </Flex>

        <Flex gap={20}>
          <Button onClick={scrape} disabled={isLoading}>
            {isLoading ? 'Scraping...' : 'Scrape Again'}
          </Button>
          <Button disabled={!isFinishEnabled} onClick={() => finish()}>
            Finish
          </Button>
        </Flex>
      </PageBottomComponent>
    </div>
  );
};

const StatusText = ({ status }: { status: NoitaDataWakScrapeResultStatus }) => {
  let data: { color: string; tooltip: string | undefined };

  if (status === NoitaDataWakScrapeResultStatus.FAILED) {
    data = { color: '#DE4646', tooltip: undefined };
  } else if (status === NoitaDataWakScrapeResultStatus.SUCCESS) {
    data = { color: '#87BF1C', tooltip: undefined };
  } else if (status === NoitaDataWakScrapeResultStatus.SKIPPED) {
    data = {
      color: '#F7C34F',
      tooltip: 'Skipped, as a previous task was not finished',
    };
  } else {
    data = {
      color: 'white',
      tooltip: undefined,
    };
  }

  return (
    <NoitaTooltipWrapper content={data.tooltip}>
      <span
        style={{
          color: data.color,
        }}
      >
        {status}
      </span>
    </NoitaTooltipWrapper>
  );
};

interface NoitaDataWakScrapeResultDisplayProps<T> {
  title: string;
  result: NoitaDataWakScrapeResultPart<T[]>;
  dataIconMapper: (args: T) => React.ReactNode;
}

function NoitaDataWakScrapeResultDisplay<T>({
  title,
  result,
  dataIconMapper,
}: NoitaDataWakScrapeResultDisplayProps<T>) {
  const { state: showAll, flip: flipShowAll } = useBool();

  return (
    <Card>
      <Header title={title}>
        <div>
          Status: <StatusText status={result.status} />
        </div>
        {!!result.error && <div>Error: {JSON.stringify(result.error)}</div>}
        {result.data && (
          <>
            <div>Count: {result.data.length}</div>
            <Flex
              wrap='wrap'
              style={{
                cursor: 'pointer',
              }}
              title={showAll ? 'Shrink' : 'Expand'}
              onClick={() => flipShowAll()}
            >
              {!showAll && (
                <>
                  {result.data.slice(0, 8).map(dataIconMapper)} <span>...</span>
                </>
              )}
              {showAll && result.data.map(dataIconMapper)}
            </Flex>
          </>
        )}
      </Header>
    </Card>
  );
}
