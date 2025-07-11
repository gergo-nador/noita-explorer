function isBrowser() {
  return typeof window !== 'undefined' && window.document;
}

function isNode() {
  return (
    typeof process !== 'undefined' && process.versions && process.versions.node
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
