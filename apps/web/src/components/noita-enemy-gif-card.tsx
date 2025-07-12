import { NoitaEnemy, NoitaEnemyGif } from '@noita-explorer/model-noita';
import {
  BooleanIcon,
  NoitaTooltipWrapper,
  PixelatedImage,
  useCounter,
} from '@noita-explorer/noita-component-library';
import { useState } from 'react';
import { Flex } from '@noita-explorer/react-utils';

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

  return (
    <Flex style={{ width: 'fit-content' }} column center>
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
      </NoitaTooltipWrapper>
      {gif.loop ? (
        <div>
          <PixelatedImage
            src={`/public/g/enemy-gifs/${enemy.id}/${gif.name}.gif`}
            alt={`${enemy.name} ${gif.name}`}
            width={width}
            height={height}
          />
        </div>
      ) : (
        <div
          onClick={() => increaseGifRestartCounter()}
          onMouseEnter={() => setShowGif(true)}
          onMouseLeave={() => setShowGif(false)}
        >
          {showGif ? (
            <PixelatedImage
              src={`/public/g/enemy-gifs/${enemy.id}/${gif.name}.gif?c=${gifRestartCounter}`}
              alt={`${enemy.name} ${gif.name}`}
              width={width}
              height={height}
              onMouseEnter={() => increaseGifRestartCounter()}
            />
          ) : (
            <PixelatedImage
              src={`/public/g/enemy-gifs/${enemy.id}/${gif.name}-f.png`}
              alt={`${enemy.name} ${gif.name}`}
              width={width}
              height={height}
              onMouseEnter={() => increaseGifRestartCounter()}
            />
          )}
        </div>
      )}
    </Flex>
  );
};
