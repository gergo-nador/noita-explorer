import { SpriteAnimation } from '@noita-explorer/model-noita';

export const calculateFramePositions = (
  animation: SpriteAnimation,
): { x: number; y: number }[] => {
  const positions: Array<{ x: number; y: number }> = [];

  for (let frameIndex = 0; frameIndex < animation.frameCount; frameIndex++) {
    const col = frameIndex % animation.framesPerRow;
    const row = Math.floor(frameIndex / animation.framesPerRow);

    const x = animation.posX + col * animation.frameWidth;
    const y = animation.posY + row * animation.frameHeight;

    positions.push({ x, y });
  }

  return positions;
};
