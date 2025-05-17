// Composite Design Pattern
export interface StringKeyDictionaryComposite<T> {
  [key: string]: T | StringKeyDictionaryComposite<T>;
}
