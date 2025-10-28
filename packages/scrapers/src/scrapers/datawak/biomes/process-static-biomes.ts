import { NoitaBiome, NoitaBiomeMap } from '@noita-explorer/model-noita';
import { Vector2d } from '@noita-explorer/model';

interface Props {
  biomes: NoitaBiome[];
  map: NoitaBiomeMap;
}

export function processStaticBiomes({ biomes, map }: Props) {
  for (let biomeIndex = 0; biomeIndex < biomes.length; biomeIndex++) {
    const biome = biomes[biomeIndex];
    const staticTile = biome.staticTile;
    if (!staticTile) continue;

    let firstBiomeLocation: Vector2d | undefined = undefined;
    let lastBiomeLocation: Vector2d | undefined = undefined;

    for (let i = 0; i < map.biomeSize.x; i++) {
      for (let j = 0; j < map.biomeSize.y; j++) {
        const currentBiomeIndex = map.biomeIndices[j][i];
        if (currentBiomeIndex !== biomeIndex) continue;

        if (firstBiomeLocation === undefined) {
          firstBiomeLocation = { x: i, y: j };
        }

        lastBiomeLocation = { x: i, y: j };
      }
    }

    if (firstBiomeLocation === undefined || lastBiomeLocation === undefined) {
      continue;
    }

    staticTile.position = {
      x: firstBiomeLocation.x - map.biomeOffset.x,
      y: firstBiomeLocation.y - map.biomeOffset.y,
    };
    staticTile.size = {
      x: lastBiomeLocation.x - firstBiomeLocation.x + 1,
      y: lastBiomeLocation.y - firstBiomeLocation.y + 1,
    };
  }
}
