import { Command } from 'clipanion';
import execa from 'execa';

import { ProjectCommand } from './project-command';

export class PublishCommand extends ProjectCommand {
  @Command.Boolean('--dry-run')
  public dryRun = false;

  @Command.Path('release')
  async execute(): Promise<number> {
    if (this.projectInfo.private) {
      this.context.stdout.write('⚠️ No publishing for private modules.\n\n');
      return 0;
    }

    await this.cli.run(['package']);

    const command = require.resolve('jsii-release/bin/jsii-release');
    const args = [''];

    await execa(command, args, {
      stdio: ['ignore', 'inherit', 'inherit'],
    });

    return 0;
  }
}
