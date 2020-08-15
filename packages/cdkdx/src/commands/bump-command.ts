import { Command } from 'clipanion';
import execa from 'execa';
import standardVersion from 'standard-version';

import { BaseProjectCommand } from '../base-command';
import { GitRepository } from '../git-repository';

export class BumpCommand extends BaseProjectCommand {
  @Command.Boolean('--dry-run')
  public dryRun = false;

  @Command.Path('bump')
  async execute(): Promise<number> {
    await standardVersion({
      dryRun: this.dryRun,
      path: this.context.cwd,
    });

    if (!this.dryRun) {
      const gitRepository = new GitRepository(this.context.cwd);

      const currentBranch = await gitRepository.getCurrentBranch();

      const command = 'git';
      const args = ['push', '--follow-tags', 'origin', currentBranch];

      await execa(command, args, {
        stdio: ['ignore', 'inherit', 'inherit'],
      });
    }

    return 0;
  }
}
