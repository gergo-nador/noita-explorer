import { CallStatement } from 'luaparse';
import { LuaValuWrapper, LuaValueWrapperType } from './lua-valu-wrapper.ts';

export interface LuaCallStatementWrapperType {
  identifier: string;
  arguments: () => LuaValueWrapperType[] | undefined;
}

export const LuaCallStatementWrapper = (
  callStatement: CallStatement,
): LuaCallStatementWrapperType => {
  const expression = callStatement.expression;
  const identifier = LuaValuWrapper(expression.base).required.asIdentifier();

  return {
    identifier: identifier,
    arguments: () => {
      if (expression.type !== 'CallExpression') return undefined;
      return expression.arguments.map((a) => LuaValuWrapper(a));
    },
  };
};
