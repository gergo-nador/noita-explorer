import { nameof } from './nameof.ts';
import { runtimeEnvironment } from './runtime-environment.ts';

function notImplementedException(func: Function): never {
  const functionName = nameof(func);
  throw new Error(`${functionName} is not implemented`);
}

function notImplementedInCurrentEnvironmentException(func: Function): never {
  const functionName = nameof(func);

  return runtimeEnvironment.pick({
    node: () => {
      throw new Error(`${functionName} is not implemented in node.js`);
    },
    browser: () => {
      throw new Error(`${functionName} is not implemented in browsers`);
    },
  });
}

export const throwHelpers = {
  notImplemented: notImplementedException,
  notImplementedInCurrentEnvironment:
    notImplementedInCurrentEnvironmentException,
};
