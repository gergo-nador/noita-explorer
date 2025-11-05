import { AssignmentStatement, Chunk, parse } from 'luaparse';
import { LuaAssignmentStatementWrapper } from './lua-assignment-statement-wrapper.ts';
import { stringHelpers } from '../main.ts';

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
    findTopLevelFunctionCallWithStringArgument: (
      functionName: string,
      stringArgument: string,
    ) => {
      return lookForTopLevelFunctionWithArgument(
        parsed,
        functionName,
        stringArgument,
      );
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

function lookForTopLevelFunctionWithArgument(
  parsed: Chunk,
  functionName: string,
  stringArgument: string,
) {
  for (const call of parsed.body) {
    if (call.type !== 'CallStatement') continue;

    const expression = call.expression;
    if (expression.type !== 'CallExpression') continue;

    if (
      expression.base.type !== 'Identifier' ||
      expression.base.name !== functionName
    ) {
      continue;
    }

    if (expression.arguments.length !== 1) {
      continue;
    }

    const argument = expression.arguments[0];
    if (argument.type !== 'StringLiteral') continue;

    const argumentValue = stringHelpers.trim({
      text: argument.raw,
      fromStart: '\\"',
      fromEnd: '\\"',
    });

    if (argumentValue !== stringArgument) continue;

    return call;
  }
}
