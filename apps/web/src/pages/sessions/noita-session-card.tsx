import { NoitaSession } from '@noita-explorer/model-noita';
import {
  Card,
  Icon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { publicPaths } from '../../utils/public-paths.ts';
import { SpaceCharacter } from '../../components/space-character.tsx';
import { timeHelpers } from '@noita-explorer/tools';
import { Flex } from '@noita-explorer/react-utils';

interface Props {
  session: NoitaSession;
}

export const NoitaSessionCard = ({ session }: Props) => {
  return (
    <Card key={session.id}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <div>
            <Icon src={publicPaths.static.dataWak.icons('die2')} size={18} />
            <SpaceCharacter />
            {session.seed}
          </div>
          <div>
            <Icon
              src={publicPaths.static.dataWak.spellProperties('lifetime')}
              size={20}
            />
            {timeHelpers.secondsToTimeString(session.playTime)}
          </div>
          <div>
            <Flex align='end'>
              <Icon src={publicPaths.static.dataWak.icons('money')} size={20} />
              {session.goldInfinite && <span>∞</span>}
              {!session.goldInfinite && (
                <NoitaTooltipWrapper
                  content={<div style={{ fontSize: 18 }}>gold / all gold</div>}
                >
                  <span>
                    {session.gold} / {session.goldAll}
                  </span>
                </NoitaTooltipWrapper>
              )}
            </Flex>
          </div>

          <div>
            {!session.dead && <div>Not dead</div>}
            {session.dead && (
              <div>
                <Icon
                  src={publicPaths.static.dataWak.icons('icon_danger')}
                  size={20}
                />
                {session.killedByEntity === undefined &&
                  session.killedByReason === undefined && <span>New Game</span>}
                {!!session.killedByEntity && (
                  <span>{session.killedByEntity}: </span>
                )}
                {!!session.killedByReason && (
                  <span>{session.killedByReason}</span>
                )}
              </div>
            )}
          </div>
          <div>
            <Icon src={publicPaths.static.dataWak.icons('enemy')} size={20} />
            {session.enemiesKilled}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>
            <span className={'text-secondary'}>
              {session.startedAt.toLocaleString()}
            </span>
          </div>
          <div className={'text-secondary'}>{session.buildName}</div>
        </div>
      </div>
    </Card>
  );
};
