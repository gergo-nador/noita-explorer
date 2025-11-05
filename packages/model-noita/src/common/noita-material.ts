export type NoitaMaterialCellType = 'liquid' | 'solid' | 'fire' | 'gas';
export const NoitaMaterialCellTypeValidValues = new Set<NoitaMaterialCellType>([
  'liquid',
  'solid',
  'fire',
  'gas',
]);

export interface NoitaMaterial {
  id: string;
  name: string;
  tags: string[];
  // [solid, liquid, fire, gas], default: liquid
  cellType: NoitaMaterialCellType;
  wangColor: string;
  wangColorHtml: string;
  gfxGlow: number | undefined;
  gfxGlowColor: string | undefined;
  graphicsColor: string | undefined;
  hasGraphicsImage: boolean;
  graphicsImagePath: string | undefined;
  // Makes the material conduct electricity. Defaults to 1 when
  // cell_type="liquid" and liquid_sand="0", otherwise it defaults to 0.
  electricalConductivity: boolean;
  // How resistant it is to damage. https://noita.wiki.gg/wiki/Materials#Hardness
  hardness: number | undefined;
  stickiness: number | undefined;
  // https://noita.wiki.gg/wiki/Materials#Durability
  durability: number | undefined;
  // More dense materials seep through lesser ones.
  density: number | undefined;
  burnable: boolean;
  liquidSand: boolean;
  wikiLink?: string;

  parent:
    | {
        id: string;
        inherit_reactions: boolean;
      }
    | undefined;

  stainEffects: NoitaMaterialStain[];
  ingestionEffects: NoitaMaterialIngestion[];
}

export interface NoitaMaterialStain {
  effectType: string;
}
export interface NoitaMaterialIngestion {
  effectType: string;
  effectAmount?: number;
}
