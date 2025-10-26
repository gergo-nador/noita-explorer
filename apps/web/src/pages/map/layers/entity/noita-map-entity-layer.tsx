import { ImageOverlay } from 'react-leaflet';
import { ChunkRenderableEntity } from '@noita-explorer/map';

interface Props {
  entities: ChunkRenderableEntity[];
}

export const NoitaMapEntityLayer = ({ entities }: Props) => {
  return (
    <>
      {entities.map((entity) =>
        entity.sprites.map((sprite) => {
          // Same coordinate conversion as before
          const mapX = sprite.position.x;
          const mapY = -sprite.position.y;

          if (sprite.imageData.width === undefined) return;
          if (sprite.imageData.height === undefined) return;

          return (
            <ImageOverlay
              url={sprite.base64}
              bounds={[
                [mapY + sprite.imageData.height, mapX],
                [mapY, mapX + sprite.imageData.width],
              ]}
              opacity={1} // Make it slightly transparent
              zIndex={10} // Ensure it's on top of the tiles
            />
          );
        }),
      )}
    </>
  );
};
