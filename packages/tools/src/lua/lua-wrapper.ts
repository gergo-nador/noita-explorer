import { AssignmentStatement, Chunk, parse } from 'luaparse';
import { LuaAssignmentStatementWrapper } from './lua-assignment-statement-wrapper.ts';

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

      return LuaAssignmentStatementWrapper(assignmentStatement);
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

  if (assignment === undefined) {
    throw new Error(
      `'${variableName}' assignment not found in the lua script.`,
    );
  }

  return assignment;
}
