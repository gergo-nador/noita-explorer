import { NoitaGenomeData } from '../noita-genome-data.ts';
import { NoitaEntityTransform } from '../noita-entity-transform.ts';
import { NoitaKickComponent } from '../noita-kick-component.ts';
import { NoitaWalletComponent } from './noita-wallet-component.ts';
import { NoitaDamageModel } from './noita-damage-model.ts';
import { NoitaPlayerInventory } from './noita-player-inventory.ts';
import { NoitaPlayerFlyState } from './noita-player-fly-state.ts';

export interface NoitaPlayerState {
  transform: NoitaEntityTransform;
  damageModel: NoitaDamageModel;
  inventory: NoitaPlayerInventory;
  genomeData?: NoitaGenomeData;
  kick?: NoitaKickComponent;
  wallet?: NoitaWalletComponent;
  decorations: {
    player_hat2?: { enabled: boolean };
    player_amulet?: { enabled: boolean };
    player_amulet_gem?: { enabled: boolean };
  };
  fly?: NoitaPlayerFlyState;
}

// TODO: investigate MaterialInventoryComponent
// TODO: investigate StatusEffectDataComponent
// TODO: investigate VariableStorageComponent
