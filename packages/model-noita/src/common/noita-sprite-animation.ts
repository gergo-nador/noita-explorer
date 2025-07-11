export interface SpriteAnimation {
  name: string;
  frameCount: number;
  /**
   * Used to calculate the frame positions
   */
  frameHeight: number;
  /**
   * Actual frame height, depends on the shrinkByOnePixel property
   */
  frameActualHeight: number;
  /**
   * Used to calculate the frame positions
   */
  frameWidth: number;
  /**
   * Actual frame width, depends on the shrinkByOnePixel property
   */
  frameActualWidth: number;
  frameWait: number;
  framesPerRow: number;
  loop: boolean;
  posX: number;
  posY: number;
  shrinkByOnePixel: boolean;
}

export interface Sprite {
  spriteFilename: string;
  defaultAnimation: string | undefined;
  animations: SpriteAnimation[];
}
