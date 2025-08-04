import minimist from 'minimist';
import process from 'node:process';

export const args: Record<string, string> = minimist(process.argv.slice(2));
