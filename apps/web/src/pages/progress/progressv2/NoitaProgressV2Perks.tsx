import {
  ActiveIconWrapper,
  Card,
  Icon,
  NoitaTooltipWrapper,
  ProgressIcon,
} from '@noita-explorer/noita-component-library';
import { NoitaProgressIconTable } from '../../../components/NoitaProgressIconTable.tsx';
import { useNoitaDataWakStore } from '../../../stores/NoitaDataWak.ts';
import { useState } from 'react';
import { NoitaPerk } from '@noita-explorer/model-noita';
import { Flex } from '../../../components/Flex.tsx';
import { NoitaProtections } from '../../../noita/NoitaProtections.ts';
import { BooleanIcon } from '../../../components/BooleanIcon.tsx';
import { MultiSelectionBoolean } from '../../../components/MultiSelectionBoolean.tsx';
import { MultiSelection } from '../../../components/MultiSelection.tsx';
import { useSave00Store } from '../../../stores/save00.ts';

interface PerkFilters {
  stackable: boolean | undefined;
  holyMountain: boolean | undefined;
  oneOffEffect: boolean | undefined;
  removedByNullifyingAltar: boolean | undefined;
  protectionId: string | undefined;
  unlocked: boolean | undefined;
}

export const NoitaProgressV2Perks = () => {
  const { data } = useNoitaDataWakStore();
  const [selectedPerk, setSelectedPerk] = useState<NoitaPerk>();
  const [filters, setFilters] = useState<PerkFilters>({
    stackable: undefined,
    holyMountain: undefined,
    oneOffEffect: undefined,
    removedByNullifyingAltar: undefined,
    protectionId: undefined,
    unlocked: undefined,
  });
  const { unlockedPerks } = useSave00Store();

  if (!data) {
    return <div>Noita Data Wak is not loaded.</div>;
  }

  const evaluateFiltersForPerk = (perk: NoitaPerk) => {
    if (filters.stackable !== undefined) {
      if (filters.stackable !== perk.stackable) {
        return false;
      }
    }

    if (filters.holyMountain !== undefined) {
      if (filters.holyMountain !== !perk.notInDefaultPerkPool) {
        return false;
      }
    }

    if (filters.oneOffEffect !== undefined) {
      if (filters.oneOffEffect !== perk.oneOffEffect) {
        return false;
      }
    }

    if (filters.removedByNullifyingAltar !== undefined) {
      if (filters.removedByNullifyingAltar !== !perk.doNotRemove) {
        return false;
      }
    }

    if (filters.protectionId !== undefined) {
      if (!perk.gameEffects.includes(filters.protectionId)) {
        return false;
      }
    }

    if (filters.unlocked !== undefined && unlockedPerks !== undefined) {
      if (!(filters.unlocked || !unlockedPerks.includes(perk.id))) {
        return false;
      }
    }

    return true;
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '6fr 6fr',
        gap: 20,
        maxWidth: '1220px', // 500px left panel + 20px gap + 500px right panel
        margin: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '700px',
          minWidth: '200px',
        }}
      >
        <NoitaProgressIconTable
          count={data.spells.length}
          name={'Spells'}
          columnCount={9}
          iconGap={4}
        >
          {data.perks.map((perk) => {
            const filter = evaluateFiltersForPerk(perk);
            const icon = (
              <ProgressIcon type={'regular'} icon={perk.imageBase64} />
            );

            return (
              <div
                style={{
                  opacity: filter ? 1 : 0.35,
                }}
              >
                {!filter && icon}
                {filter && (
                  <ActiveIconWrapper
                    id={'perk-' + perk.id}
                    key={'perk-' + perk.id}
                    onClick={() => setSelectedPerk(perk)}
                    tooltip={
                      <div>
                        <div style={{ fontSize: 20 }}>{perk.name}</div>
                      </div>
                    }
                  >
                    {icon}
                  </ActiveIconWrapper>
                )}
              </div>
            );
          })}
        </NoitaProgressIconTable>
      </div>

      <div>
        <PerkFiltersView
          setFilters={setFilters}
          filters={filters}
          showSave00RelatedFilters={unlockedPerks !== undefined}
        />
        <br />
        <Card style={{ maxWidth: '500px', width: '100%' }}>
          {!selectedPerk && <span>Select a perk</span>}
          {selectedPerk && <PerkOverview perk={selectedPerk} />}
        </Card>
      </div>
    </div>
  );
};

const PerkFiltersView = ({
  setFilters,
  filters,
  showSave00RelatedFilters,
}: {
  filters: PerkFilters;
  setFilters: (filters: PerkFilters) => void;
  showSave00RelatedFilters: boolean;
}) => {
  return (
    <Card>
      <Flex gap={10} style={{ maxWidth: 'max-content' }}>
        <span>Stackable: </span>
        <MultiSelectionBoolean
          setValue={(value) => setFilters({ ...filters, stackable: value })}
          currentValue={filters.stackable}
        />
      </Flex>
      <Flex gap={10} style={{ maxWidth: 'max-content' }}>
        <span>Holy Mountain: </span>
        <MultiSelectionBoolean
          setValue={(value) => setFilters({ ...filters, holyMountain: value })}
          currentValue={filters.holyMountain}
        />
      </Flex>
      <Flex gap={10} style={{ maxWidth: 'max-content' }}>
        <span>One-Off Effect: </span>
        <MultiSelectionBoolean
          setValue={(value) => setFilters({ ...filters, oneOffEffect: value })}
          currentValue={filters.oneOffEffect}
        />
      </Flex>
      <Flex gap={10} style={{ maxWidth: 'max-content' }}>
        <span>Removed by NA: </span>
        <MultiSelectionBoolean
          setValue={(value) =>
            setFilters({
              ...filters,
              removedByNullifyingAltar: value,
            })
          }
          currentValue={filters.removedByNullifyingAltar}
        />
      </Flex>
      {showSave00RelatedFilters && (
        <Flex gap={10} style={{ maxWidth: 'max-content' }}>
          <span>Unlocked: </span>
          <MultiSelectionBoolean
            setValue={(value) =>
              setFilters({
                ...filters,
                unlocked: value,
              })
            }
            currentValue={filters.unlocked}
          />
        </Flex>
      )}

      <Flex gap={10} style={{ maxWidth: 'max-content' }}>
        <span>Protections:</span>
        <MultiSelection<string | undefined>
          options={Object.keys(NoitaProtections).map((protectionId) => ({
            id: protectionId,
            value: protectionId,
            display: (
              <Icon
                type={'custom'}
                src={NoitaProtections[protectionId].image}
                size={30}
              />
            ),
            style: {
              opacity: 0.6,
            },
            selectedProperties: {
              opacity: 1,
            },
            onClick: (_, isSelected) =>
              isSelected && setFilters({ ...filters, protectionId: undefined }),
          }))}
          setValue={(value) =>
            setFilters({
              ...filters,
              protectionId: value,
            })
          }
          currentValue={filters.protectionId}
        />
      </Flex>
    </Card>
  );
};

const PerkOverview = ({ perk }: { perk: NoitaPerk }) => {
  const tableSectionDivider = <td colSpan={3} style={{ height: 20 }}></td>;

  return (
    <>
      <div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '15% 1fr',
            width: '100%',
            gap: 5,
          }}
        >
          <Icon
            type={'custom'}
            src={perk.imageBase64}
            style={{ aspectRatio: 1, width: '100%' }}
          />
          <div>
            <div style={{ fontSize: 20, marginBottom: 10 }}>{perk.name}</div>
            <div>{perk.description}</div>
          </div>
        </div>
        <div style={{ marginTop: 20, width: 'max-content' }}>
          <NoitaTooltipWrapper content={'Protections'}>
            <Flex style={{ width: 'max-content' }}>
              {perk.gameEffects
                .filter((gameEffect) => gameEffect in NoitaProtections)
                .map((gameEffect) => (
                  <Icon
                    key={gameEffect}
                    type={'custom'}
                    src={NoitaProtections[gameEffect].image}
                    size={40}
                  />
                ))}
            </Flex>
          </NoitaTooltipWrapper>
        </div>
        <br />
        <Flex>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ paddingRight: 20 }}>Stackable</td>
                <td style={{ textAlign: 'right' }}>
                  <BooleanIcon value={perk.stackable} />
                </td>
              </tr>

              {perk.stackable && (
                <tr>
                  <td colSpan={3}>
                    <table style={{ width: '100%' }}>
                      <tbody>
                        <tr>
                          <td>Max</td>
                          <td>Is Rare</td>
                        </tr>
                        <tr>
                          <td>{perk.stackableMaximum ?? '-'}</td>
                          <td>
                            <BooleanIcon value={perk.stackableIsRare} />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
              <tr>{tableSectionDivider}</tr>
              <tr>
                <td>Holy Mountain</td>
                <td style={{ textAlign: 'right' }}>
                  <BooleanIcon value={!perk.notInDefaultPerkPool} />
                </td>
              </tr>
              {!perk.notInDefaultPerkPool && (
                <tr>
                  <td colSpan={3}>
                    <table style={{ width: '100%' }}>
                      <tbody>
                        <tr>
                          <td>Pool Max</td>
                          <td>
                            Reappears
                            <br /> After
                          </td>
                        </tr>
                        <tr>
                          <td>{perk.maxInPerkPool ?? '-'}</td>
                          <td>{perk.stackableHowOftenReappears ?? '-'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}

              <tr>{tableSectionDivider}</tr>
              <tr>
                <td style={{ paddingRight: 20 }}>
                  Will not be removed by nullifying altar
                </td>
                <td style={{ textAlign: 'right' }}>
                  <BooleanIcon value={perk.doNotRemove} />
                </td>
              </tr>
              <tr>
                <td style={{ paddingRight: 20 }}>One-Off Effect</td>
                <td style={{ textAlign: 'right' }}>
                  <BooleanIcon value={perk.oneOffEffect} />
                </td>
              </tr>
            </tbody>
          </table>
        </Flex>
      </div>
    </>
  );
};
