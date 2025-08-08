import minimist from 'minimist';
import process from 'node:process';
import * as path from 'path';

export const args: Record<string, string> = minimist(process.argv.slice(2));

export const getArgument = (name: string) => {
  if (!(name in args)) {
    throw new Error(`Missing argument: ${name}`);
  }

  return args[name];
};

export const getArgumentPath = (name: string) => {
  const value = getArgument(name);
  return path.resolve(value);
};
