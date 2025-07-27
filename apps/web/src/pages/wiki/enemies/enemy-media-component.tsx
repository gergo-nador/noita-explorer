import { NoitaEnemy } from '@noita-explorer/model-noita';
import { useMemo } from 'react';
import { Flex } from '@noita-explorer/react-utils';
import { NoitaEnemyGifCard } from '../../../components/noita-enemy-gif-card.tsx';
import { PixelatedImage } from '@noita-explorer/noita-component-library';
import { publicPaths } from '../../../utils/public-paths.ts';

interface Props {
  enemy: NoitaEnemy;
}

export const EnemyMediaComponent = ({ enemy }: Props) => {
  const gifs = useMemo(() => {
    const media = enemy.media;
    if (media?.type !== 'gif') {
      return undefined;
    }

    const gifs = [...Object.values(media.gifs)];
    gifs.sort((g1, g2) => {
      // sort infinite animations in front
      const loopDiff = Number(g2.loop) - Number(g1.loop);
      if (loopDiff !== 0) {
        return loopDiff;
      }

      // sort alphabetically
      return g1.name.localeCompare(g2.name);
    });
    return gifs;
  }, [enemy.media]);

  if (enemy.media === undefined) {
    return;
  }

  return (
    <div>
      <hr />
      {enemy.media.type === 'image' && (
        <div>
          <PixelatedImage
            src={publicPaths.enemyImage({
              enemyId: enemy.id,
              type: enemy.media.imageType,
            })}
          />
        </div>
      )}
      {gifs && (
        <Flex gap={16} wrap='wrap'>
          {gifs.map((gif) => (
            <NoitaEnemyGifCard
              key={gif.name}
              gif={gif}
              enemy={enemy}
              width={gif.frameWidth * 3}
              height={gif.frameHeight * 3}
            />
          ))}
        </Flex>
      )}
    </div>
  );
};
