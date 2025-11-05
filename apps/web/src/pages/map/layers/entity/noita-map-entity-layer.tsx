import {
  ChunkRenderableEntity,
  ChunkRenderableEntitySprite,
} from '@noita-explorer/map';
import { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { rotatedImageOverlay } from '../../utils/leaflet-image-overlay-rotated';

interface Props {
  entities: ChunkRenderableEntity[];
}

export const NoitaMapEntityLayer = ({ entities }: Props) => {
  return (
    <>
      {entities.map((entity) =>
        entity.sprites
          .filter((sprite) => !sprite.isBackgroundComponent)
          .map((sprite, i) => {
            return (
              <EntitySprite
                key={`${entity.name}-${sprite.position.x}-${sprite.position.y}-${sprite.rotation}-${i}`}
                sprite={sprite}
              />
            );
          }),
      )}
    </>
  );
};

export const EntitySprite = ({
  sprite,
}: {
  sprite: ChunkRenderableEntitySprite;
}) => {
  const map = useMap();

  useEffect(() => {
    if (
      !map ||
      sprite.imageData.width === undefined ||
      sprite.imageData.height === undefined
    ) {
      return;
    }

    const mapX = sprite.position.x;
    const mapY = -sprite.position.y;

    const width = sprite.imageData.width;
    const height = sprite.imageData.height;

    const left = mapX - width / 2;
    const right = mapX + width / 2;
    const top = mapY + height / 2;
    const bottom = mapY - width / 2;

    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;

    const radians = -sprite.rotation;
    const corners = {
      topLeft: { x: left, y: top },
      topRight: { x: right, y: top },
      bottomLeft: { x: left, y: bottom },
    };

    const rotTopLeft = rotatePoint({
      ...corners.topLeft,
      cx: centerX,
      cy: centerY,
      radians: radians,
    });
    const rotTopRight = rotatePoint({
      ...corners.topRight,
      cx: centerX,
      cy: centerY,
      radians: radians,
    });
    const rotBottomLeft = rotatePoint({
      ...corners.bottomLeft,
      cx: centerX,
      cy: centerY,
      radians: radians,
    });

    const offsetY = sprite.offset.y;
    const offsetX = sprite.offset.x;

    const overlay = rotatedImageOverlay(
      sprite.base64,
      L.latLng(rotTopLeft.y - offsetY, rotTopLeft.x - offsetX),
      L.latLng(rotTopRight.y - offsetY, rotTopRight.x - offsetX),
      L.latLng(rotBottomLeft.y - offsetY, rotBottomLeft.x - offsetX),
      {
        opacity: 1,
        interactive: false,
      },
    );

    overlay.addTo(map);
    overlay._image.style.imageRendering = 'pixelated';

    return () => {
      map.removeLayer(overlay);
    };
  }, [map, sprite]);

  return null;
};

function rotatePoint({
  x,
  y,
  cx,
  cy,
  radians,
}: {
  x: number;
  y: number;
  cx: number;
  cy: number;
  radians: number;
}) {
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);

  let px = x - cx;
  let py = y - cy;

  const nx = px * cos - py * sin;
  const ny = px * sin + py * cos;

  px = nx + cx;
  py = ny + cy;

  return { x: px, y: py };
}
