import { TableConstructorExpression } from 'luaparse';
import { StringKeyDictionary } from '@noita-explorer/model';
import { LuaValueWrapperType, LuaValueWrapper } from './LuaValueWrapper';

export interface LuaObjectDeclarationWrapperType {
  keys: string[];
  getField: (fieldName: string) => LuaValueWrapperType | undefined;
  getRequiredField: (fieldName: string) => LuaValueWrapperType;
}

export const LuaObjectDeclarationWrapper = (
  objectDeclaration: TableConstructorExpression,
): LuaObjectDeclarationWrapperType => {
  const obj: StringKeyDictionary<LuaValueWrapperType> = {};

  for (const field of objectDeclaration.fields) {
    if (!('key' in field)) continue;

    const key = field['key'];
    if (key['type'] !== 'Identifier') continue;

    const propertyName: string = key['name'];
    const propertyValue = LuaValueWrapper(field.value);

    if (propertyValue === undefined) {
      continue;
    }

    obj[propertyName] = propertyValue;
  }

  return {
    keys: Object.keys(obj),
    getField: (fieldName) => {
      if (fieldName in obj) {
        return obj[fieldName];
      }

      return undefined;
    },
    getRequiredField: (fieldName) => {
      if (fieldName in obj) {
        return obj[fieldName];
      }

      throw new Error(`Required field '${fieldName}' not found`);
    },
  };
};
