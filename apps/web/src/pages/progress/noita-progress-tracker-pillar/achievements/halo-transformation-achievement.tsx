import { StringKeyDictionary } from '@noita-explorer/model';
import { AchievementPerk } from '../achievement-perk.ts';
import { arrayHelpers, colorHelpers, ifStatement } from '@noita-explorer/tools';
import { Flex } from '@noita-explorer/react-utils';
import { Icon, ProgressIcon } from '@noita-explorer/noita-component-library';
import halo from '../../../../assets/player_halo_light.png';
import haloDark from '../../../../assets/player_halo_dark.png';

export const HaloTransformationAchievement = ({
  perks,
}: {
  perks: StringKeyDictionary<AchievementPerk>;
}) => {
  const plusOnePerks = [
    'respawn',
    'saving_grace',
    'peace_with_gods',
    'genome_more_love',
  ];
  const plusOneSum = arrayHelpers.sumBy(
    plusOnePerks,
    (id) => perks[id]?.count ?? 0,
  );

  const minusOnePerks = [
    'vampirism',
    'global_gore',
    'exploding_corpses',
    'genome_more_hatred',
  ];
  const minusOneSum = arrayHelpers.sumBy(
    minusOnePerks,
    (id) => perks[id]?.count ?? 0,
  );

  const diff = plusOneSum - minusOneSum;

  const colorLight = '#FFDE17';
  const colorDark = '#FF2F17';
  const lighten = colorHelpers.manipulation.lighten;

  return (
    <div>
      <div>Halo Transformation</div>
      <br />
      <Flex justify='space-between'>
        <Flex gap={2} direction='column'>
          {minusOnePerks.map((perkId) => (
            <Flex gap={4} align='center'>
              <ProgressIcon icon={perks[perkId]?.perk?.imageBase64} size={30} />
              <span>{perks[perkId]?.count ?? 0}</span>
            </Flex>
          ))}
          <Flex justify='end'>
            <span style={{ color: colorDark }}>∑ {minusOneSum}</span>
          </Flex>
        </Flex>
        <Flex justify='end' align='center' direction='column'>
          {diff <= -3 && <Icon src={haloDark} size={20} />}
          {diff >= 3 && <Icon src={halo} size={20} />}
          <span
            style={{
              color: ifStatement(diff === 0, 'initial')
                // closer to halo
                .elseIf(diff === 1, lighten(colorLight, 0.7))
                .elseIf(diff === 2, lighten(colorLight, 0.4))
                .elseIf(diff >= 3, colorLight)
                // closer to dark halo
                .elseIf(diff === -1, lighten(colorDark, 0.7))
                .elseIf(diff === -2, lighten(colorDark, 0.4))
                .elseIf(diff <= -3, colorDark)
                // ending
                .else('initial'),
            }}
          >
            {diff > 0 ? '+' : ''}
            {diff}
          </span>
        </Flex>
        <Flex gap={2} direction='column'>
          {plusOnePerks.map((perkId) => (
            <Flex gap={4} align='center'>
              <span>{perks[perkId]?.count ?? 0}</span>
              <ProgressIcon icon={perks[perkId]?.perk?.imageBase64} size={30} />
            </Flex>
          ))}
          <Flex justify='start'>
            <span style={{ color: colorLight }}>{plusOneSum} ∑</span>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};
