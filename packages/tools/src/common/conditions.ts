export const ifStatement = <T>(condition: boolean, value: T) =>
  inlineIfStatement<T>(condition, value, undefined);

interface IfStatementType<T> {
  elseIf: (condition: boolean, value: T) => IfStatementType<T>;
  else: (value: T) => T;
}

const inlineIfStatement = <T>(
  condition: boolean,
  value: T,
  existingReturnValue: { val: T } | undefined,
): IfStatementType<T> => {
  if (!existingReturnValue && condition) {
    existingReturnValue = { val: value };
  }

  return {
    elseIf: (condition: boolean, value: T): IfStatementType<T> =>
      inlineIfStatement(condition, value, existingReturnValue),
    else: (value: T): T => {
      if (existingReturnValue) {
        value = existingReturnValue.val;
      }

      return value;
    },
  };
};
