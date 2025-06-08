import { CallStatement, FunctionDeclaration } from 'luaparse';
import {
  LuaAssignmentStatementWrapper,
  LuaAssignmentStatementWrapperType,
} from './lua-assignment-statement-wrapper.ts';
import {
  LuaCallStatementWrapper,
  LuaCallStatementWrapperType,
} from './lua-call-statement-wrapper.ts';
import { LuaValueWrapper } from './lua-value-wrapper.ts';
import { StringKeyDictionary } from '@noita-explorer/model';

export interface LuaFunctionDeclarationWrapperType {
  getAssignments: () => LuaAssignmentStatementWrapperType[];
  findCallAssignment: (
    identifier: string,
  ) => LuaCallStatementWrapperType | undefined;
}

export const LuaFunctionDeclarationWrapper = (
  functionDeclaration: FunctionDeclaration,
): LuaFunctionDeclarationWrapperType => {
  return {
    getAssignments: () => {
      return functionDeclaration.body
        .filter((statement) => statement.type === 'AssignmentStatement')
        .map((statement) => LuaAssignmentStatementWrapper(statement));
    },
    findCallAssignment: (identifier) => {
      const results = findCallAssignments(functionDeclaration.body)
        .filter((c) => c.expression.type === 'CallExpression')
        .filter(
          (c) =>
            LuaValueWrapper(c.expression.base).asIdentifier() === identifier,
        );

      if (results.length === 0) return undefined;

      const callStatement = results[0];
      return LuaCallStatementWrapper(callStatement);
    },
  };
};

const findCallAssignments = (
  obj: unknown,
  results: CallStatement[] = [],
): CallStatement[] => {
  if (obj === undefined) {
    return results;
  }

  if (typeof obj !== 'object') {
    return results;
  }

  if (Array.isArray(obj)) {
    for (const o of obj) {
      findCallAssignments(o, results);
    }
  }

  const dict: StringKeyDictionary<unknown> =
    obj as StringKeyDictionary<unknown>;

  for (const propName in dict) {
    const propValue = dict[propName];
    if (propName === 'type' && propValue === 'CallStatement') {
      const callStatement = obj as CallStatement;
      results.push(callStatement);
    }

    findCallAssignments(propValue, results);
  }

  return results;
};
