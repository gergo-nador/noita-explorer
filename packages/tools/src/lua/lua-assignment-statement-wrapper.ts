import { AssignmentStatement } from 'luaparse';
import {
  LuaAssignmentWrapper,
  LuaAssignmentWrapperType,
} from './lua-assignment-wrapper.ts';

export interface LuaAssignmentStatementWrapperType {
  first: () => LuaAssignmentWrapperType;
  getAssignments: () => LuaAssignmentWrapperType[];
}

export const LuaAssignmentStatementWrapper = (
  assignmentStatement: AssignmentStatement,
): LuaAssignmentStatementWrapperType => {
  return {
    first: () => {
      const variable = assignmentStatement.variables[0];
      const expression = assignmentStatement.init[0];

      return LuaAssignmentWrapper(variable, expression);
    },
    getAssignments: () => {
      const arr: LuaAssignmentWrapperType[] = [];
      const assignmentCount = assignmentStatement.variables.length;

      for (let i = 0; i < assignmentCount; i++) {
        const variable = assignmentStatement.variables[i];
        const expression = assignmentStatement.init[i];

        const assignment = LuaAssignmentWrapper(variable, expression);
        arr.push(assignment);
      }

      return arr;
    },
  };
};
