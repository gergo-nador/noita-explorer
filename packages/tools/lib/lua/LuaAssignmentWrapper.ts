import {
  Expression,
  Identifier,
  IndexExpression,
  MemberExpression,
} from 'luaparse';
import { LuaObjectDeclarationWrapperType } from './LuaObjectDeclarationWrapper';
import { LuaValueWrapper } from './LuaValueWrapper';
import { LuaExpressionPart } from './LuaExpressionPart';

export interface LuaAssignmentWrapperType {
  getName: () => string;
  asExpression: () => LuaExpressionPart[];
  asArrayObjectDeclarationIterator: () => Generator<LuaObjectDeclarationWrapperType>;
}

export const LuaAssignmentWrapper = (
  variable: Identifier | MemberExpression | IndexExpression,
  expression: Expression,
): LuaAssignmentWrapperType => {
  return {
    getName: () => LuaValueWrapper(variable).asIdentifier(),
    asExpression: () => getExpressionValue(expression),
    asArrayObjectDeclarationIterator: () =>
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

function* processArrayObjectDeclaration(expression: Expression) {
  const array = LuaValueWrapper(expression).asArray();
  if (array === undefined) {
    throw new Error('array is undefined');
  }

  // loop through each object of the array
  for (const item of array) {
    const obj = item.asObject();
    if (obj !== undefined) {
      continue;
    }
    yield obj;
  }
}
