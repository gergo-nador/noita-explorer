export interface NoitaDamageMultipliers {
  curse: number;
  drill: number;
  electricity: number;
  explosion: number;
  fire: number;
  healing: number;
  holy: number;
  ice: number;
  melee: number;
  overeating: number;
  physics_hit: number;
  poison: number;
  projectile: number;
  radioactive: number;
  slice: number;
}

export const getDefaultNoitaDamageMultipliers = (): NoitaDamageMultipliers => {
  const defaultDamageMultiplier = 1;

  return {
    curse: defaultDamageMultiplier,
    drill: defaultDamageMultiplier,
    electricity: defaultDamageMultiplier,
    explosion: defaultDamageMultiplier,
    fire: defaultDamageMultiplier,
    healing: defaultDamageMultiplier,
    holy: defaultDamageMultiplier,
    ice: defaultDamageMultiplier,
    melee: defaultDamageMultiplier,
    overeating: defaultDamageMultiplier,
    physics_hit: defaultDamageMultiplier,
    poison: defaultDamageMultiplier,
    projectile: defaultDamageMultiplier,
    radioactive: defaultDamageMultiplier,
    slice: defaultDamageMultiplier,
  };
};
