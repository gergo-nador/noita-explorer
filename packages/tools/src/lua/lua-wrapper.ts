import {
  AssignmentStatement,
  Chunk,
  FunctionDeclaration,
  parse,
} from 'luaparse';
import { LuaAssignmentStatementWrapper } from './lua-assignment-statement-wrapper.ts';
import { LuaFunctionDeclarationWrapper } from './lua-function-declaration-wrapper.ts';

/**
 * The main entry point for the Lua tools. It parses the text and returns a wrapper object around it.
 * @param text
 * @constructor
 */
export const LuaWrapper = (text: string) => {
  const parsed = parse(text);
  return {
    findTopLevelAssignmentStatement: (variableName: string) => {
      const assignmentStatement = lookForTopLevelAssignmentStatement(
        parsed,
        variableName,
      );

      if (!assignmentStatement) return;

      return LuaAssignmentStatementWrapper(assignmentStatement);
    },
    findTopLevelFunctionDeclaration: (functionName: string) => {
      const functionDeclaration = lookForTopLevelFunctionDeclaration(
        parsed,
        functionName,
      );

      if (!functionDeclaration) return;

      return LuaFunctionDeclarationWrapper(functionDeclaration);
    },
  };
};

function lookForTopLevelAssignmentStatement(
  parsed: Chunk,
  variableName: string,
) {
  let assignment: AssignmentStatement | undefined = undefined;

  for (const statement of parsed.body) {
    if (
      statement.type === 'AssignmentStatement' &&
      statement.variables.length !== 0 &&
      statement.variables[0].type === 'Identifier' &&
      statement.variables[0].name === variableName
    ) {
      assignment = statement;
      break;
    }
  }

  return assignment;
}

function lookForTopLevelFunctionDeclaration(
  parsed: Chunk,
  functionName: string,
) {
  let functionToLookFor: FunctionDeclaration | undefined = undefined;

  for (const func of parsed.body) {
    if (func.type === 'FunctionDeclaration') {
      const identifier = func.identifier;
      if (identifier?.type !== 'Identifier') continue;
      if (identifier.name !== functionName) continue;

      functionToLookFor = func;
      break;
    }
  }

  return functionToLookFor;
}
