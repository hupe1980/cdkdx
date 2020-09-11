import execa from 'execa';

export class GitRepository {
  constructor(private readonly cwd: string) {
    execa.sync('git', ['--version'], {
      stdio: 'ignore',
    });
  }

  public async isInGitRepository(): Promise<boolean> {
    try {
      await execa('git', ['rev-parse', '--is-inside-work-tree'], {
        cwd: this.cwd,
        stdio: 'ignore',
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  public async initializeGitRepository(): Promise<void> {
    await execa('git', ['init'], {
      cwd: this.cwd,
      stdio: 'ignore',
    });

    await execa('git', ['add', '.'], {
      cwd: this.cwd,
      stdio: 'ignore',
    });

    await execa('git', ['commit', '-m="Initial commit"'], {
      cwd: this.cwd,
      stdio: 'ignore',
    });
  }

  public async getCurrentBranch(): Promise<string> {
    const { stdout: currentBranch } = await execa(
      'git',
      ['rev-parse', '--abbrev-ref', 'HEAD'],
      {
        cwd: this.cwd,
      },
    );

    return currentBranch;
  }

  public async getAuthor(): Promise<string> {
    const { stdout: author } = await execa(
      'git',
      ['config', '--global', 'user.name'],
      {
        cwd: this.cwd,
      },
    );

    return author.trim();
  }
}
