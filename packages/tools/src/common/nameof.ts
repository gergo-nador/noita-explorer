export function nameof(arg: Function) {
  if (typeof arg === 'function') {
    return arg.name;
  }
}
