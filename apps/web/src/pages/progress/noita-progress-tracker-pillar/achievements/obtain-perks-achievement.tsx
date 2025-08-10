import { StringKeyDictionary } from '@noita-explorer/model';
import { Flex } from '@noita-explorer/react-utils';
import { ProgressIcon } from '@noita-explorer/noita-component-library';
import { AchievementPerk } from '../achievement-perk.ts';
import { publicPaths } from '../../../../utils/public-paths.ts';

export const ObtainPerksAchievement = ({
  title,
  perksToObtain,
  perks,
}: {
  title: string;
  perksToObtain: { id: string; amount: number }[];
  perks: StringKeyDictionary<AchievementPerk>;
}) => {
  return (
    <div>
      <div>{title}</div>
      <br />

      <Flex justify='space-evenly'>
        {perksToObtain.map((perkToObtain) => {
          const achievementPerk = perks[perkToObtain.id];
          const count = achievementPerk?.count ?? 0;
          return (
            <Flex direction='column' align='center' gap={5}>
              <ProgressIcon
                icon={publicPaths.generated.perk.image({
                  perkId: achievementPerk?.perk?.id,
                })}
                size={40}
              />
              <span
                className={count >= perkToObtain.amount ? 'text-success' : ''}
              >
                {count}/{perkToObtain.amount}
              </span>
            </Flex>
          );
        })}
      </Flex>
    </div>
  );
};
