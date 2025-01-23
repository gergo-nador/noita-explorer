export interface NoitaMaterialReaction {
  inputComponents: NoitaMaterialReactionComponent[];
  outputComponents: NoitaMaterialReactionComponent[];
  probability: number;
}

export interface NoitaMaterialReactionComponent {
  componentId: string;
}
