import { NoitaWalletComponent } from './noita-wallet-component.ts';
import { NoitaDamageModel } from './noita-damage-model.ts';
import { NoitaPlayerInventory } from './noita-player-inventory.ts';
import { NoitaPlayerFlyState } from './noita-player-fly-state.ts';
import { NoitaEntityTransform } from '../enemy/noita-entity-transform.ts';
import { NoitaGenomeData } from '../enemy/noita-genome-data.ts';
import { NoitaKickComponent } from '../enemy/noita-kick-component.ts';

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
