import * as path from 'path';
import * as fs from 'fs-extra';
import execa from 'execa';
import callbackGlob from 'glob';

export const glob = async (pattern: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    callbackGlob(pattern, (err, files) => {
      if (err) {
        return reject(err);
      }
      resolve(files);
    });
  });
};

export const cwd = fs.realpathSync(process.cwd());

export const resolveProject = (relativePath: string): string =>
  path.resolve(cwd, relativePath);

export const resolveOwn = (relativePath: string): string =>
  path.resolve(__dirname, '..', relativePath);

export interface InstallCommand {
  command: 'yarn' | 'npm';
  args: string[];
}

export const getInstallCommand = async (): Promise<InstallCommand> => {
  try {
    await execa('yarn', ['--version']);
    return { command: 'yarn', args: [] };
  } catch (_e) {
    return { command: 'npm', args: ['i'] };
  }
};

export const getAuthor = async (): Promise<string> => {
  const { stdout } = await execa('git', ['config', '--global', 'user.name']);

  return stdout.trim() || 'TODO_ADD_AUTHOR';
};

export const isInGitRepository = async (cwd?: string): Promise<boolean> => {
  try {
    await execa('git', ['rev-parse', '--is-inside-work-tree'], {
      cwd,
      stdio: 'ignore',
    });
    return true;
  } catch (e) {
    return false;
  }
};
