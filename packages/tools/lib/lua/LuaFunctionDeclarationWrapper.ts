import { FunctionDeclaration } from 'luaparse';
import {
  LuaAssignmentStatementWrapper,
  LuaAssignmentStatementWrapperType,
} from './LuaAssignmentStatementWrapper';

export interface LuaFunctionDeclarationWrapperType {
  getAssignments: () => LuaAssignmentStatementWrapperType[];
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
  };
};
