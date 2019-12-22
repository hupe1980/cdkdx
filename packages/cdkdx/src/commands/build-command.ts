import { Command } from 'clipanion';

import { BaseCommand } from './base-command';

export class BuildCommand extends BaseCommand {
  @Command.Path(`build`)
  async execute() {
    const bundleExitCode = await this.cli.run([`bundle`]);

    if (bundleExitCode !== 0) return bundleExitCode;

    this.context.stdout.write(`bla`);
    return 0;
  }
}
