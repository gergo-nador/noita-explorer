export const ifStatement = <T>(condition: boolean, value: T) =>
  inlineIfStatement(condition, value, false, undefined);

interface IfStatementType<T> {
  elseIf: (condition: boolean, value: T) => IfStatementType<T>;
  else: (value: T) => T;
}

const inlineIfStatement = <T>(
  condition: boolean,
  value: T,
  hasReturnValue: boolean,
  returnValue: T,
): IfStatementType<T> => {
  if (!hasReturnValue && condition) {
    hasReturnValue = true;
    returnValue = value;
  }

  return {
    elseIf: (condition: boolean, value: T): IfStatementType<T> =>
      inlineIfStatement(condition, value, hasReturnValue, returnValue),
    else: (value: T): T => {
      if (!hasReturnValue) {
        returnValue = value;
      }

      return returnValue;
    },
  };
};
