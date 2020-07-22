import * as path from 'path';
import { Command } from 'clipanion';
import execa from 'execa';

import { ProjectCommand } from './project-command';

export class ReleaseCommand extends ProjectCommand {
  @Command.String({ required: true })
  public type!: 'all' | 'npm' | 'pypi';

  @Command.Path('release')
  async execute(): Promise<number> {
    if (this.projectInfo.private) {
      this.context.stdout.write('⚠️ No releasing for private modules.\n\n');
      return 0;
    }

    await this.cli.run(['package']);

    const [command, args] = ((): [string, string[]] => {
      switch (this.type) {
        case 'npm':
          return [
            require.resolve('jsii-release/bin/jsii-release-npm'),
            [path.join(this.projectInfo.projectPath, 'dist', 'js')],
          ];
        case 'pypi':
          return [
            require.resolve('jsii-release/bin/jsii-release-pypi'),
            [path.join(this.projectInfo.projectPath, 'dist', 'python')],
          ];
        case 'all':
          return [
            require.resolve('jsii-release/bin/jsii-release'),
            [path.join(this.projectInfo.projectPath, 'dist')],
          ];
        default:
          throw new Error(`Invalid release type: ${this.type}`);
      }
    })();

    await execa(command, args, {
      stdio: ['ignore', 'inherit', 'inherit'],
    });

    return 0;
  }
}
