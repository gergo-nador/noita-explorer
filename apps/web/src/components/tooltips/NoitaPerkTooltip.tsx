import { NoitaPerk } from '@noita-explorer/model';
import { Icon } from '@noita-explorer/noita-component-library';
import { Flex } from '../Flex.tsx';
import { NoitaProtections } from '../../noita/NoitaProtections.ts';
import { BooleanIcon } from '../BooleanIcon.tsx';

interface NoitaPerkTooltipProps {
  perk: NoitaPerk;
  isUnknown?: boolean;
}

export const NoitaPerkTooltip = ({
  perk,
  isUnknown,
}: NoitaPerkTooltipProps) => {
  if (isUnknown) {
    return <div>???</div>;
  }

  return (
    <div style={{ maxWidth: '400px', minWidth: '300px', lineHeight: '16px' }}>
      <Flex
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '35px',
        }}
      >
        <span style={{ fontSize: 20 }}>{perk.name}</span>
        <Flex>
          {perk.gameEffects
            .filter((gameEffect) => gameEffect in NoitaProtections)
            .map((gameEffect) => (
              <Icon
                key={gameEffect}
                type={'custom'}
                src={NoitaProtections[gameEffect].image}
                size={35}
              />
            ))}
        </Flex>
      </Flex>

      <div>{perk.description}</div>

      <br />
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
          <tr>
            <td colSpan={3} style={{ height: 10 }}></td>
          </tr>
          <tr>
            <td colSpan={3}>Holy Mountain</td>
          </tr>
          <tr>
            <td colSpan={3}>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td>
                      Available <br />
                      in HM
                    </td>
                    <td>Pool Max</td>
                    <td>
                      Reappears
                      <br /> After
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <BooleanIcon value={!perk.notInDefaultPerkPool} />
                    </td>
                    <td>{perk.maxInPerkPool ?? '-'}</td>
                    <td>{perk.stackableHowOftenReappears ?? '-'}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td colSpan={3} style={{ height: 10 }}></td>
          </tr>
          <tr>
            <td style={{ paddingRight: 20 }}>
              Will not be removed by <br />
              nullifying altar
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
    </div>
  );
};
