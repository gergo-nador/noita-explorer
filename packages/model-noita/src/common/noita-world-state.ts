export interface NoitaWorldState {
  dayCount: number;
  modsActiveDuringThisRun: boolean;
  runType: 'nightmare' | 'normal' | 'daily' | 'dailyPractice';
  perks: {
    goldIsForever: boolean;
    infiniteSpells: boolean;
    ratsPlayerFriendly: boolean;
    // perk_hp_drop_chance ??
    // perk_trick_kills_blood_money
    pickedPerks: NoitaRunPickedPerk[];
  };

  flags: {
    newActionIds: string[];
    newPerkIds: string[];
    newEnemyIds: string[];
  };
  helplessKills: number | undefined;
  fungalShifts: NoitaRunFungalShift[];
}

export interface NoitaRunPickedPerk {
  perkId: string;
  count: number | undefined;
}

export interface NoitaRunFungalShift {
  fromMaterials: string[];
  toMaterials: string[];
}
