import * as path from 'path';
import { Command } from 'clipanion';
import execa from 'execa';

import { BaseProjectCommand } from '../base-command';
import { Timer } from '../timer';

export class ReleaseCommand extends BaseProjectCommand {
  static usage = Command.Usage({
    description: 'Release the project',
    details: `
      This command releases the project to npm, pypi or both.

      It is checked whether the package version is not yet registered. If the version is not in the registry, it will be released. Otherwise the process will be ignored.
    `,
    examples: [
      ['Release to npm', 'cdkdx release npm'],
      ['Release to pypi', 'cdkdx release pypi'],
    ],
  });

  @Command.String({ required: true })
  public type!: 'all' | 'npm' | 'pypi';

  @Command.Path('release')
  async execute(): Promise<number> {
    const timer = new Timer();

    if (this.projectInfo.private) {
      this.context.logger.warn('No releasing for private modules.\n');
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

    timer.end();

    this.context.logger.done(
      `Project ${this.projectInfo.name} released in ${timer.display()}.\n`,
    );

    return 0;
  }
}
