import fs from 'fs-extra';
import path from 'path';

export const clearConsole = (): void => {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  );
};

export const appDirectory = fs.realpathSync(process.cwd());

export const resolveApp = (relativePath: string): string =>
  path.resolve(appDirectory, relativePath);
