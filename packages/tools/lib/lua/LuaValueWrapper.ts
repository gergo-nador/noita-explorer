import { Expression } from 'luaparse';
import { trim } from '../StringUtils';
import {
  LuaFunctionDeclarationWrapper,
  LuaFunctionDeclarationWrapperType,
} from './LuaFunctionDeclarationWrapper';
import {
  LuaObjectDeclarationWrapper,
  LuaObjectDeclarationWrapperType,
} from './LuaObjectDeclarationWrapper';

export interface LuaValueWrapperType {
  asIdentifier: () => string | undefined;
  asString: () => string | undefined;
  asNumber: () => number | undefined;
  asBoolean: () => boolean | undefined;
  asArray: () => LuaValueWrapperType[] | undefined;
  asObject: () => LuaObjectDeclarationWrapperType | undefined;
  asFunction: () => LuaFunctionDeclarationWrapperType | undefined;
}

export const LuaValueWrapper = (field: Expression): LuaValueWrapperType => {
  const fieldValue = field;
  const fieldValueType = fieldValue['type'];

  const getValueAsIdentifier = () => {
    if (fieldValueType === 'Identifier') {
      return fieldValue['name'];
    }

    if (fieldValueType === 'MemberExpression') {
      const base = LuaValueWrapper(fieldValue['base']);
      const identifier = LuaValueWrapper(fieldValue['identifier']);
      const indexer = fieldValue['indexer'];

      return base.asIdentifier() + indexer + identifier.asIdentifier();
    }

    return undefined;
  };

  const getValueAsStringLiteral = () => {
    if (fieldValueType !== 'StringLiteral') {
      return undefined;
    }

    const tempValue: string = fieldValue['raw'] ?? '';
    // the string literal signs are also included in the
    // raw values, so let's remove them
    return trim({
      text: tempValue,
      fromStart: '"',
      fromEnd: '"',
    });
  };

  const getValueAsNumericLiteral = () => {
    if (fieldValueType === 'NumericLiteral') {
      return fieldValue['value'];
    }

    // negative numbers
    if (
      fieldValueType === 'UnaryExpression' &&
      fieldValue['operator'] === '-' &&
      fieldValue['argument']['type'] === 'NumericLiteral'
    ) {
      const numeric = fieldValue['argument']['value'];
      return numeric * -1;
    }

    return undefined;
  };

  const getValueAsBooleanLiteral = () => {
    if (fieldValueType !== 'BooleanLiteral') {
      return undefined;
    }

    return fieldValue['value'];
  };

  const getValueAsArray = () => {
    if (fieldValueType !== 'TableConstructorExpression') {
      return undefined;
    }

    const fieldArray = fieldValue['fields'];
    const array: LuaValueWrapperType[] = [];

    for (const obj of fieldArray) {
      const value = LuaValueWrapper(obj.value);
      array.push(value);
    }

    return array;
  };

  const getValueAsObjectDeclaration = () => {
    if (!('fields' in fieldValue)) {
      return undefined;
    }

    return LuaObjectDeclarationWrapper(fieldValue);
  };

  const getValueAsFunctionDeclaration = () => {
    if (fieldValueType !== 'FunctionDeclaration') {
      return undefined;
    }

    return LuaFunctionDeclarationWrapper(fieldValue);
  };

  return {
    asIdentifier: getValueAsIdentifier,
    asString: getValueAsStringLiteral,
    asNumber: getValueAsNumericLiteral,
    asBoolean: getValueAsBooleanLiteral,
    asArray: getValueAsArray,
    asObject: getValueAsObjectDeclaration,
    asFunction: getValueAsFunctionDeclaration,
  };
};
