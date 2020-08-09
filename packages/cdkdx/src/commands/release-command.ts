import * as path from 'path';
import { Command } from 'clipanion';
import execa from 'execa';

import { BaseProjectCommand } from '../base-command';

export class ReleaseCommand extends BaseProjectCommand {
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
            [path.join(this.projectInfo.distPath, 'js')],
          ];
        case 'pypi':
          return [
            require.resolve('jsii-release/bin/jsii-release-pypi'),
            [path.join(this.projectInfo.distPath, 'python')],
          ];
        case 'all':
          return [
            require.resolve('jsii-release/bin/jsii-release'),
            [this.projectInfo.distPath],
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
