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

export const getAuthor = async (): Promise<string> => {
  const { stdout } = await execa('git', [
    'config', '--global', 'user.name',
  ]);

  return stdout.trim() || 'TODO_ADD_AUTHOR';
}
