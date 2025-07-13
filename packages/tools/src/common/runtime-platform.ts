import { runtimeEnvironment } from './runtime-environment.ts';

const platform = () => {
  const isMacOs = runtimeEnvironment.isNode() && process.platform === 'darwin';
  const isLinux = runtimeEnvironment.isNode() && process.platform === 'linux';
  const isWindows = runtimeEnvironment.isNode() && process.platform === 'win32';

  return {
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
};

export const platformHelpers = platform();
