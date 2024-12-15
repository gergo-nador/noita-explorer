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
  ImportResult,
  ImportResultPart,
  ImportResultStatus,
  NoitaWakData,
} from '@noita-explorer/model';
import { PageBottomComponent } from '../../components/PageBottomComponent';
import { Flex } from '../../components/Flex';
import { noitaAPI } from '../../ipcHandlers';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pages } from '../../routes/pages';
import { useNoitaDataWakStore } from '../../stores/NoitaDataWak';

export const SetupDesktopScraper = () => {
  const navigate = useNavigate();
  const [importResult, setImportResult] = useState<ImportResult>();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { load: loadNoitaDataWak } = useNoitaDataWakStore();

  const [isFinishEnabled, setIsFinishEnabled] = useState(false);

  const scrape = async () => {
    setIsLoading(true);

    const result = await noitaAPI.noita.dataFile.scrape();
    console.log(result);
    setImportResult(result);

    setIsLoading(false);
  };

  const save = (): Promise<NoitaWakData> => {
    if (!importResult) {
      toast.error('Scraped data was not found.');
      return new Promise((_resolve, reject) => reject());
    }

    const translations = importResult.translations.data ?? {};
    const enemies = importResult.enemies.data ?? [];
    const perks = importResult.perks.data ?? [];
    const spells = importResult.spells.data ?? [];

    const now = new Date();

    const data: NoitaWakData = {
      scrapedAt: now.toISOString(),
      scrapedAtUnix: now.getTime(),
      version: 1,
      translations: translations,
      enemies: enemies,
      perks: perks,
      spells: spells,
    };

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
    if (isLoading || !importResult) {
      setIsFinishEnabled(false);
      return;
    }

    if (
      importResult.perks.status !== ImportResultStatus.SUCCESS ||
      importResult.spells.status !== ImportResultStatus.SUCCESS ||
      importResult.enemies.status !== ImportResultStatus.SUCCESS
    ) {
      setIsFinishEnabled(false);
      return;
    }

    setIsFinishEnabled(true);
  }, [importResult, isLoading]);

  return (
    <div>
      <Header title={'Scraper'}>
        {isLoading && <div>Loading...</div>}
        <br />
        {importResult && (
          <Flex style={{ gap: '10px' }}>
            {importResult.translations.status !==
              ImportResultStatus.SUCCESS && (
              <Card>
                <Header title={'Translation'}>
                  <div>
                    Status:
                    <StatusText status={importResult.translations.status} />
                  </div>
                  {!!importResult.translations.error && (
                    <div>
                      Error: {JSON.stringify(importResult.translations.error)}
                    </div>
                  )}
                </Header>
              </Card>
            )}

            <ImportResultDisplay
              title={'Perks'}
              result={importResult.perks}
              dataIconMapper={(perk) => (
                <ProgressIcon
                  key={perk.id}
                  type={'regular'}
                  icon={perk.imageBase64}
                  size={24}
                />
              )}
            />

            <ImportResultDisplay
              title={'Spells'}
              result={importResult.spells}
              dataIconMapper={(spell) => (
                <ProgressIcon
                  key={spell.id}
                  type={'regular'}
                  icon={spell.imageBase64}
                  size={24}
                />
              )}
            />

            <ImportResultDisplay
              title={'Enemies'}
              result={importResult.enemies}
              dataIconMapper={(enemy) => (
                <ProgressIcon
                  key={enemy.id}
                  type={'regular'}
                  icon={enemy.imageBase64}
                  size={24}
                />
              )}
            />
          </Flex>
        )}
      </Header>
      <PageBottomComponent>
        <Flex gap={10}>
          <Button onClick={() => navigate(pages.setup.paths)}>Back</Button>
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

const StatusText = ({ status }: { status: ImportResultStatus }) => {
  let data: { color: string; tooltip: string | undefined };

  if (status === ImportResultStatus.FAILED) {
    data = { color: '#DE4646', tooltip: undefined };
  } else if (status === ImportResultStatus.SUCCESS) {
    data = { color: '#87BF1C', tooltip: undefined };
  } else if (status === ImportResultStatus.SKIPPED) {
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

interface ImportResultDisplayProps<T> {
  title: string;
  result: ImportResultPart<T[]>;
  dataIconMapper: (args: T) => React.ReactNode;
}

function ImportResultDisplay<T>({
  title,
  result,
  dataIconMapper,
}: ImportResultDisplayProps<T>) {
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
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
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
            </div>
          </>
        )}
      </Header>
    </Card>
  );
}
