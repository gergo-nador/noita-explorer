import { XmlWrapperType } from '@noita-explorer/tools/xml';
import { Sprite, SpriteAnimation } from '@noita-explorer/model-noita';

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

    const frameHeight = animationElement
      .getRequiredAttribute('frame_height')
      .asInt();
    const frameWidth = animationElement
      .getRequiredAttribute('frame_width')
      .asInt();

    const shrinkByOnePixel =
      animationElement.getAttribute('shrink_by_one_pixel')?.asBoolean() ??
      false;

    const animation: SpriteAnimation = {
      name: animationElement.getRequiredAttribute('name').asText(),
      frameCount: animationElement.getRequiredAttribute('frame_count').asInt(),
      frameHeight: frameHeight,
      frameActualHeight: shrinkByOnePixel ? frameHeight - 1 : frameHeight,
      frameWidth: frameWidth,
      frameActualWidth: shrinkByOnePixel ? frameWidth - 1 : frameWidth,
      frameWait: animationElement.getRequiredAttribute('frame_wait').asFloat(),
      framesPerRow: animationElement
        .getRequiredAttribute('frames_per_row')
        .asInt(),
      // default value is true
      loop: loopAttr ? (loopAttr.asBoolean() ?? false) : true,
      posX: animationElement.getRequiredAttribute('pos_x').asInt(),
      posY: animationElement.getRequiredAttribute('pos_y').asInt(),
      shrinkByOnePixel: shrinkByOnePixel,
    };

    sprite.animations.push(animation);
  }

  return sprite;
};
