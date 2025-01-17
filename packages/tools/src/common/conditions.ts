export const ifStatement = <T>(condition: boolean, value: T) =>
  inlineIfStatement(condition, value, false, undefined);

const inlineIfStatement = <T>(
  condition: boolean,
  value: T,
  hasReturnValue: boolean,
  returnValue: T,
) => {
  if (!hasReturnValue && condition) {
    hasReturnValue = true;
    returnValue = value;
  }

  return {
    elseIf: (condition: boolean, value: T) =>
      inlineIfStatement(condition, value, hasReturnValue, returnValue),
    else: (value: T): T => {
      if (!hasReturnValue) {
        returnValue = value;
      }

      return returnValue;
    },
  };
};
