export interface NoitaBiome {
  group: string;
  bgImagePath?: string;
  bgImageEdgeLeft?: string;
  bgImageEdgeRight?: string;
  bgImageEdgeTop?: string;
  bgImageEdgeBottom?: string;
  bgImageEdgePriority?: number;
  limitBackgroundImage: boolean;
  backgroundImageHeight: number | undefined;
  staticTileBgMask: string | undefined;
}
