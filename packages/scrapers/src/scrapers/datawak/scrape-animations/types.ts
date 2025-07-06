export interface SpriteAnimation {
  name: string;
  frameCount: number;
  frameHeight: number;
  frameWidth: number;
  frameWait: number;
  framesPerRow: number;
  loop: boolean;
  posX: number;
  posY: number;
}

export interface Sprite {
  spriteFilename: string;
  defaultAnimation: string | undefined;
  animations: SpriteAnimation[];
}
