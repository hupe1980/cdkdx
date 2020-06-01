import * as path from 'path';
import * as fs from 'fs-extra';
import execa from 'execa';

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

export const isRoot = (dir: string): boolean => path.dirname(dir) === dir;

export const isInGitRepository = async (dir: string): Promise<boolean> => {
  do {
    const exist = await fs.pathExists(path.join(dir, '.git'));

    if (exist) {
      return true;
    }

    dir = path.dirname(dir);
  } while (!isRoot(dir));

  return false;
};

export const getAuthor = async (): Promise<string> => {
  let author: string;
  
  const { stdout: npmConfigStdout } = await execa('npm', ['config','get','init-author-name']);
  author = npmConfigStdout.trim();
  
  if(author) return author;

  const { stdout: gitConfigStdout } = await execa('git', [
    'config', '--global', 'user.name',
  ]);
  author = gitConfigStdout.trim();

  return author;
}
