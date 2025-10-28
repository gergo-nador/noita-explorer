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
        const currentBiomeIndex = map.biomeIndices[i][j];
        if (currentBiomeIndex !== biomeIndex) continue;

        if (firstBiomeLocation === undefined) {
          firstBiomeLocation = { x: i, y: j };
        }

        lastBiomeLocation = { x: j, y: j };
      }
    }

    if (firstBiomeLocation === undefined || lastBiomeLocation === undefined) {
      continue;
    }

    staticTile.position = firstBiomeLocation;
    staticTile.size = {
      x: lastBiomeLocation.x - firstBiomeLocation.x,
      y: lastBiomeLocation.y - firstBiomeLocation.y,
    };
  }
}
