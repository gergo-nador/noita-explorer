import {
  Expression,
  Identifier,
  IndexExpression,
  MemberExpression,
} from 'luaparse';
import { LuaObjectDeclarationWrapperType } from './lua-object-declaration-wrapper.ts';
import { LuaValueWrapper } from './lua-value-wrapper.ts';
import { LuaExpressionPart } from './lua-expression-part.ts';

export interface LuaAssignmentWrapperType {
  getName: () => string;
  asExpression: () => LuaExpressionPart[];
  asArrayObjectDeclarationList: () => LuaObjectDeclarationWrapperType[];
}

export const LuaAssignmentWrapper = (
  variable: Identifier | MemberExpression | IndexExpression,
  expression: Expression,
): LuaAssignmentWrapperType => {
  return {
    getName: () => {
      const name = LuaValueWrapper(variable).asIdentifier();
      if (name === undefined) {
        throw new Error('identifier name is undefined.');
      }
      return name;
    },
    asExpression: () => getExpressionValue(expression),
    asArrayObjectDeclarationList: () =>
      processArrayObjectDeclaration(expression),
  };
};

const getExpressionValue = (
  expression: Expression,
  arr: LuaExpressionPart[] = [],
) => {
  if (expression.type === 'BinaryExpression') {
    const operator = expression.operator;
    const left = getExpressionValue(expression.left);
    const right = getExpressionValue(expression.right);

    // overwrite operator with the actual one
    right[0].operator = operator;

    arr = [...left, ...right];
    return arr;
  }

  const value = LuaValueWrapper(expression);

  const part: LuaExpressionPart = {
    value:
      value.asIdentifier() ??
      value.asString() ??
      value.asBoolean() ??
      value.asNumber(),
    operator: '+',
  };

  return [part];
};

function processArrayObjectDeclaration(
  expression: Expression,
): LuaObjectDeclarationWrapperType[] {
  const array = LuaValueWrapper(expression).asArray();
  if (array === undefined) {
    throw new Error('array is undefined');
  }

  const arr: LuaObjectDeclarationWrapperType[] = [];

  // loop through each object of the array
  for (const item of array) {
    const obj = item.asObject();
    if (obj === undefined) {
      continue;
    }

    arr.push(obj);
  }

  return arr;
}
