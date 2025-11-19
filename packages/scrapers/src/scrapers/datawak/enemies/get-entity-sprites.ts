import { XmlWrapperType } from '@noita-explorer/tools/xml';
import {
  NoitaScrapedPhysicsImageShapeComponent,
  NoitaScrapedSprite,
} from '@noita-explorer/model-noita';
import { splitNoitaEntityTags } from '../../common/tags.ts';
import { Vector2d } from '@noita-explorer/model';

export const getEntitySpriteComponents = ({
  entityTag,
}: {
  entityTag: XmlWrapperType;
}): NoitaScrapedSprite[] | undefined => {
  let sprites = entityTag.getChild('SpriteComponent');

  if (sprites === undefined) {
    return;
  }

  sprites = sprites
    // filter out ui, health_bar and laser_sight sprites
    .filter((sprite) => {
      const tags = sprite.getAttribute('_tags')?.asText();
      if (tags === undefined) return true;

      const split = splitNoitaEntityTags(tags);

      const notAllowedTags = ['ui', 'health_bar_back', 'health_bar'];
      return !notAllowedTags.some((tag) => split.includes(tag));
    })
    // filter out invisible sprites
    .filter((sprite) => {
      const isVisible = sprite.getAttribute('visible')?.asBoolean();
      const alpha = sprite.getAttribute('alpha')?.asFloat();
      return isVisible !== false && alpha !== 0;
    })
    // filter out sprites without image file
    .filter((sprite) => {
      const imageFile = sprite.getAttribute('image_file')?.asText();
      return Boolean(imageFile);
    })
    .filter((sprite) => {
      const fogOfWarHole = sprite.getAttribute('fog_of_war_hole')?.asBoolean();
      return !fogOfWarHole;
    });

  const transformObjects = entityTag.findTagArray('_Transform');
  const scale = transformObjects.reduce(
    (scale, current): Vector2d => ({
      x:
        scale.x !== 1
          ? scale.x
          : (current.getAttribute('scale.x')?.asFloat() ?? 1),
      y:
        scale.y !== 1
          ? scale.y
          : (current.getAttribute('scale.y')?.asFloat() ?? 1),
    }),
    { x: 1, y: 1 },
  );

  return sprites.map((sprite): NoitaScrapedSprite => {
    const tags = sprite.getAttribute('_tags')?.asText();

    return {
      tags: tags ? splitNoitaEntityTags(tags) : [],
      imageFile: sprite.getRequiredAttribute('image_file').asText(),
      alpha: sprite.getAttribute('alpha')?.asFloat(),
      additive: sprite.getAttribute('additive')?.asBoolean(),
      emissive: sprite.getAttribute('emissive')?.asBoolean(),
      offsetX: sprite.getAttribute('offset_x')?.asInt(),
      offsetY: sprite.getAttribute('offset_y')?.asInt(),
      zIndex: sprite.getAttribute('z_index')?.asFloat(),
      transform: {
        scale: {
          x: scale.x,
          y: scale.y,
        },
      },
    };
  });
};

export const getPhysicsImageShapeComponents = ({
  entityTag,
}: {
  entityTag: XmlWrapperType;
}): NoitaScrapedPhysicsImageShapeComponent[] | undefined => {
  const physicsImageShapes = entityTag.getChild('PhysicsImageShapeComponent');

  if (physicsImageShapes === undefined) {
    return;
  }

  return physicsImageShapes.map(
    (s): NoitaScrapedPhysicsImageShapeComponent => ({
      imageFile: s.getRequiredAttribute('image_file').asText(),
      offsetX: s.getAttribute('offset_x')?.asInt(),
      offsetY: s.getAttribute('offset_y')?.asInt(),
      material: s.getAttribute('material')?.asText(),
    }),
  );
};
