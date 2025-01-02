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
import { NoitaPerk } from '@noita-explorer/model';
import { Flex } from '../../../components/Flex.tsx';
import { NoitaProtections } from '../../../noita/NoitaProtections.ts';
import { BooleanIcon } from '../../../components/BooleanIcon.tsx';

export const NoitaProgressV2Perks = () => {
  const { data } = useNoitaDataWakStore();
  const [selectedPerk, setSelectedPerk] = useState<NoitaPerk>();

  if (!data) {
    return <div>Noita Data Wak is not loaded.</div>;
  }

  const tableSectionDivider = <td colSpan={3} style={{ height: 20 }}></td>;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        maxWidth: '1020px', // 500px left panel + 20px gap + 500px right panel
        margin: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          minWidth: '200px',
        }}
      >
        <NoitaProgressIconTable
          count={data.spells.length}
          name={'Spells'}
          columnCount={9}
          iconGap={4}
        >
          {data.perks.map((perk) => (
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
              <ProgressIcon type={'regular'} icon={perk.imageBase64} />
            </ActiveIconWrapper>
          ))}
        </NoitaProgressIconTable>
      </div>

      <div>
        <Card style={{ maxWidth: '500px', width: '100%' }}>
          {!selectedPerk && <span>Select a perk</span>}
          {selectedPerk && (
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
                    src={selectedPerk.imageBase64}
                    style={{ aspectRatio: 1, width: '100%' }}
                  />
                  <div>
                    <Flex
                      style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '35px',
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{selectedPerk.name}</span>
                    </Flex>
                    <div>{selectedPerk.description}</div>
                  </div>
                </div>
                <div style={{ marginTop: 20, width: 'max-content' }}>
                  <NoitaTooltipWrapper content={'Protections'}>
                    <Flex style={{ width: 'max-content' }}>
                      {selectedPerk.gameEffects
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
                          <BooleanIcon value={selectedPerk.stackable} />
                        </td>
                      </tr>

                      {selectedPerk.stackable && (
                        <tr>
                          <td colSpan={3}>
                            <table style={{ width: '100%' }}>
                              <tbody>
                                <tr>
                                  <td>Max</td>
                                  <td>Is Rare</td>
                                </tr>
                                <tr>
                                  <td>
                                    {selectedPerk.stackableMaximum ?? '-'}
                                  </td>
                                  <td>
                                    <BooleanIcon
                                      value={selectedPerk.stackableIsRare}
                                    />
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
                          <BooleanIcon
                            value={!selectedPerk.notInDefaultPerkPool}
                          />
                        </td>
                      </tr>
                      {!selectedPerk.notInDefaultPerkPool && (
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
                                  <td>{selectedPerk.maxInPerkPool ?? '-'}</td>
                                  <td>
                                    {selectedPerk.stackableHowOftenReappears ??
                                      '-'}
                                  </td>
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
                          <BooleanIcon value={selectedPerk.doNotRemove} />
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingRight: 20 }}>One-Off Effect</td>
                        <td style={{ textAlign: 'right' }}>
                          <BooleanIcon value={selectedPerk.oneOffEffect} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Flex>
              </div>
            </>
          )}
        </Card>
        <br />
        <Card>Hello</Card>
      </div>
    </div>
  );
};
