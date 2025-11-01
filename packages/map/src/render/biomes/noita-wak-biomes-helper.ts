import { NoitaWakBiomes } from '@noita-explorer/model-noita';
import { Vector2d } from '@noita-explorer/model';

interface Props {
  biomes: NoitaWakBiomes;
}

export function createNoitaWakBiomesHelper({ biomes }: Props) {
  function getBiome({ x, y }: Vector2d) {
    let yShifted = y + biomes.biomeMap.biomeOffset.y;
    // boundary from top
    yShifted = Math.max(yShifted, 0);
    // boundary from bottom
    yShifted = Math.min(yShifted, biomes.biomeMap.biomeSize.y - 1);

    // x coordinate just overlaps
    let xShifted = x + biomes.biomeMap.biomeOffset.x;
    xShifted = xShifted % biomes.biomeMap.biomeSize.x;

    const biomeIndex = biomes.biomeMap.biomeIndices[yShifted]?.[xShifted];

    return biomes.biomes[biomeIndex];
  }

  return {
    getBiome,
  };
}
