import { XmlWrapperType } from '@noita-explorer/tools/xml';
import { Sprite, SpriteAnimation } from './types.ts';

export const parseAnimationXml = ({
  id,
  xml,
}: {
  id: string;
  xml: XmlWrapperType;
}): Sprite => {
  const spriteElement = xml.findNthTag('Sprite');
  const animationElements = spriteElement?.findTagArray('RectAnimation');

  if (!spriteElement) {
    throw new Error('Sprite element not found for id ' + id);
  }
  if (!animationElements || animationElements.length === 0) {
    throw new Error(`${id} has no RectAnimation xml tags`);
  }

  const sprite: Sprite = {
    spriteFilename: spriteElement.getRequiredAttribute('filename').asText(),
    defaultAnimation: spriteElement.getAttribute('default_animation')?.asText(),
    animations: [],
  };

  for (const animationElement of animationElements) {
    const loopAttr = animationElement.getAttribute('loop');

    const animation: SpriteAnimation = {
      name: animationElement.getRequiredAttribute('name').asText(),
      frameCount: animationElement.getRequiredAttribute('frame_count').asInt(),
      frameHeight: animationElement
        .getRequiredAttribute('frame_height')
        .asInt(),
      frameWidth: animationElement.getRequiredAttribute('frame_width').asInt(),
      frameWait: animationElement.getRequiredAttribute('frame_wait').asFloat(),
      framesPerRow: animationElement
        .getRequiredAttribute('frames_per_row')
        .asInt(),
      // default value is true
      loop: loopAttr ? (loopAttr.asBoolean() ?? false) : true,
      posX: animationElement.getRequiredAttribute('pos_x').asInt(),
      posY: animationElement.getRequiredAttribute('pos_y').asInt(),
    };

    sprite.animations.push(animation);
  }

  return sprite;
};
