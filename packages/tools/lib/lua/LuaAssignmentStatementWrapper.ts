import { AssignmentStatement } from 'luaparse';
import {
  LuaAssignmentWrapper,
  LuaAssignmentWrapperType,
} from './LuaAssignmentWrapper';

export interface LuaAssignmentStatementWrapperType {
  getAssignments: () => LuaAssignmentWrapperType[];
}

export const LuaAssignmentStatementWrapper = (
  assignmentStatement: AssignmentStatement,
): LuaAssignmentStatementWrapperType => {
  return {
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
