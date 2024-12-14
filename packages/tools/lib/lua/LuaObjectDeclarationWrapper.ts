import { TableConstructorExpression } from 'luaparse';
import { StringKeyDictionary } from '@noita-explorer/model';
import { LuaValueWrapperType, LuaValueWrapper } from './LuaValueWrapper';

export interface LuaObjectDeclarationWrapperType {
  getField: (fieldName: string) => LuaValueWrapperType | undefined;
}

export const LuaObjectDeclarationWrapper = (
  objectDeclaration: TableConstructorExpression,
): LuaObjectDeclarationWrapperType => {
  const obj: StringKeyDictionary<LuaValueWrapperType> = {};

  for (const field of objectDeclaration.fields) {
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
    getField: (fieldName) => {
      if (fieldName in obj) {
        return obj[fieldName];
      }

      return undefined;
    },
  };
};
