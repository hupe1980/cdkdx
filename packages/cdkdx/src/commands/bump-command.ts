import { Command } from 'clipanion';
import execa from 'execa';
import standardVersion from 'standard-version';

import { ProjectCommand } from './project-command';

export class BumpCommand extends ProjectCommand {
  @Command.Boolean('--dry-run')
  public dryRun = false;

  @Command.Path('bump')
  async execute(): Promise<number> {
    await standardVersion({
      dryRun: this.dryRun,
      path: this.projectInfo.projectPath,
    });

    if (!this.dryRun) {
      const command = 'git';
      const args = ['push', '--follow-tags', 'origin master'];

      await execa(command, args, {
        stdio: ['ignore', 'inherit', 'inherit'],
      });
    }

    return 0;
  }
}
