import { CallStatement } from 'luaparse';
import { LuaValueWrapper, LuaValueWrapperType } from './LuaValueWrapper';

export interface LuaCallStatementWrapperType {
  identifier: string;
  arguments: () => LuaValueWrapperType[] | undefined;
}

export const LuaCallStatementWrapper = (
  callStatement: CallStatement,
): LuaCallStatementWrapperType => {
  const expression = callStatement.expression;
  const identifier = LuaValueWrapper(expression.base).required.asIdentifier();

  return {
    identifier: identifier,
    arguments: () => {
      if (expression.type !== 'CallExpression') return undefined;
      return expression.arguments.map((a) => LuaValueWrapper(a));
    },
  };
};
