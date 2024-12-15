const isMacOs = process.platform === 'darwin';
const isLinux = process.platform === 'linux';
const isWindows = process.platform === 'win32';

export const Platform = {
  isMacOs: isMacOs,
  isLinux: isLinux,
  isWindows: isWindows,

  select: function select<T = void>(args: {
    windows: () => T;
    macOs: () => T;
    linux: () => T;
  }): T {
    if (isMacOs) {
      return args.macOs();
    }
    if (isLinux) {
      return args.linux();
    }
    if (isWindows) {
      return args.windows();
    }

    throw new Error('Platform not supported: ' + process.platform);
  },

  selectValue: function selectValue<T>(args: {
    windows: T;
    macOs: T;
    linux: T;
  }): T {
    if (isMacOs) {
      return args.macOs;
    }
    if (isLinux) {
      return args.linux;
    }
    if (isWindows) {
      return args.windows;
    }

    throw new Error('Platform not supported: ' + process.platform);
  },
};
