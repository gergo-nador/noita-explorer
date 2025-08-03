import { NoitaEnemy, NoitaEnemyGif } from '@noita-explorer/model-noita';
import {
  BooleanIcon,
  NoitaTooltipWrapper,
  PixelatedImage,
  useCounter,
} from '@noita-explorer/noita-component-library';
import { useState } from 'react';
import { Flex } from '@noita-explorer/react-utils';
import { publicPaths } from '../utils/public-paths.ts';

interface Props {
  enemy: NoitaEnemy;
  gif: NoitaEnemyGif;
  width?: number | string;
  height?: number | string;
}

export const NoitaEnemyGifCard = ({ enemy, gif, width, height }: Props) => {
  const { counter: gifRestartCounter, increase: increaseGifRestartCounter } =
    useCounter();
  const [showGif, setShowGif] = useState(false);

  // @ts-expect-error string.replaceAll does exist, idk why it is flagged
  const gifDisplayName = gif.name.replaceAll('_', ' ');
  const media = publicPaths.generated.enemyGifs({
    enemyId: enemy.id,
    gifName: gif.name,
    gifReloadCounter: gifRestartCounter,
  });
  const gifPath = media.gif;
  const firstFramePath = media.firstFrame;

  return (
    <NoitaTooltipWrapper
      content={
        <div>
          <div>
            Loop: <BooleanIcon value={gif.loop} />
          </div>
          <div>Frames: {gif.frameCount}</div>
          <div>
            Dimensions: {gif.frameWidth} x {gif.frameHeight} pixels
          </div>
          <div>frame delay: {gif.frameWait * 1000}ms</div>
        </div>
      }
    >
      <Flex style={{ width: 'fit-content' }} column center>
        <div style={{ maxWidth: '100%' }}>
          <span
            style={{
              wordWrap: 'break-word',
              textWrap: 'wrap',
              width: 'min-content',
            }}
          >
            {gifDisplayName}
          </span>
          {gif.loop && <span style={{ fontSize: 10 }}> ∞</span>}
        </div>

        {gif.loop ? (
          <div>
            <PixelatedImage
              src={gifPath}
              alt={`${enemy.name} ${gif.name}`}
              width={width}
              height={height}
            />
          </div>
        ) : (
          <div
            onClick={() => increaseGifRestartCounter()}
            onMouseEnter={() => {
              setShowGif(true);
              increaseGifRestartCounter();
            }}
            onMouseLeave={() => setShowGif(false)}
          >
            {showGif ? (
              <PixelatedImage
                src={gifPath}
                alt={`${enemy.name} ${gif.name}`}
                width={width}
                height={height}
              />
            ) : (
              <PixelatedImage
                src={firstFramePath}
                alt={`${enemy.name} ${gif.name}`}
                width={width}
                height={height}
              />
            )}
          </div>
        )}
      </Flex>
    </NoitaTooltipWrapper>
  );
};
