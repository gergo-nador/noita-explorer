export interface NoitaMaterialReaction {
  id: string;
  inputComponents: NoitaMaterialReactionComponent[];
  outputComponents: NoitaMaterialReactionComponent[];
  probability: number;
  fastReaction: boolean;
  convertAll: boolean;
  direction: string | undefined;
  explosion: NoitaMaterialReactionExplosion | undefined;
}

export interface NoitaMaterialReactionComponent {
  componentId: string;
}

export interface NoitaMaterialReactionExplosion {
  explosionPower: number;
}
