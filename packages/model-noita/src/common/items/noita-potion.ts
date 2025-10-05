export interface NoitaPotion {
  materials: NoitaPotionMaterial[];
  usedCapacity: number;
  maxCapacity: number;
}

export interface NoitaPotionMaterial {
  materialId: string;
  usage: number;
}
