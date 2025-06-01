import { NoitaGenomeData } from './noita-genome-data.ts';
import { NoitaEntityTransform } from './noita-entity-transform.ts';
import { NoitaKickComponent } from './noita-kick-component.ts';
import { NoitaWalletComponent } from './player/noita-wallet-component.ts';
import { NoitaDamageModel } from './player/noita-damage-model.ts';

export interface NoitaPlayerState {
  transform: NoitaEntityTransform;
  damageModel: NoitaDamageModel;
  genomeData?: NoitaGenomeData;
  kick?: NoitaKickComponent;
  wallet?: NoitaWalletComponent;
}

// TODO: investigate MaterialInventoryComponent
// TODO: investigate StatusEffectDataComponent
// TODO: investigate VariableStorageComponent
