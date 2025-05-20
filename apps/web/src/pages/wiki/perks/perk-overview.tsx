import { NoitaPerk } from '@noita-explorer/model-noita';
import {
  Icon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { Flex } from '../../../components/flex.tsx';
import { NoitaProtections } from '../../../noita/noita-protections.ts';
import { BooleanIcon } from '../../../components/boolean-icon.tsx';

export const PerkOverview = ({ perk }: { perk: NoitaPerk }) => {
  const tableSectionDivider = <td colSpan={3} style={{ height: 20 }}></td>;

  return (
    <>
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
        <Flex style={{ width: 'max-content' }}>
          {perk.gameEffects
            .filter((gameEffect) => gameEffect in NoitaProtections)
            .map((gameEffect) => (
              <NoitaTooltipWrapper content={NoitaProtections[gameEffect].name}>
                <Icon
                  key={gameEffect}
                  type={'custom'}
                  src={NoitaProtections[gameEffect].image}
                  size={40}
                />
              </NoitaTooltipWrapper>
            ))}
        </Flex>
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
    </>
  );
};
