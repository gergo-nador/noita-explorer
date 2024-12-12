export interface SpellModifierNumberUnit {
  type: 'add' | 'subtract' | 'multiply' | 'set';
  value: number;
  operator: string;
}
