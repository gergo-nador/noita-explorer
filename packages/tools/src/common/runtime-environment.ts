function isBrowser(): boolean {
  return typeof window !== 'undefined' && window.document !== undefined;
}

function isNode(): boolean {
  return (
    typeof process !== 'undefined' &&
    process.versions &&
    process.versions.node !== undefined
  );
}

function pick<T>(arg: { node: () => T; browser: () => T }): T {
  if (isNode()) {
    return arg.node();
  }
  if (isBrowser()) {
    return arg.browser();
  }

  throw new Error('Only Node and Browser platforms are supported');
}

export const runtimeEnvironment = {
  isBrowser: isBrowser,
  isNode: isNode,

  pick: pick,
};
