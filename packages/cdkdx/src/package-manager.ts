import execa, { StdioOption } from 'execa';

export class PackageManager {
  private readonly command: 'npm' | 'yarn';

  constructor() {
    try {
      execa.sync('yarn', ['--version']);
      this.command = 'yarn';
    } catch (_e) {
      this.command = 'npm';
    }
  }

  public async install(options: {
    cwd?: string;
    stdio?: readonly StdioOption[];
    noLockfile?: boolean;
  }): Promise<void> {
    const args = ['install'];

    if (options.noLockfile) {
      args.push(this.isYarn() ? '--pure-lockfile' : '--no-lock-file');
    }

    await execa(this.command, args, {
      cwd: options.cwd,
      stdio: options.stdio,
    });
  }

  public isYarn(): boolean {
    return this.command === 'yarn';
  }
}
