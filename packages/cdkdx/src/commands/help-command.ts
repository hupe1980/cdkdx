import { Command } from 'clipanion';

import { BaseCommand } from './base-command';

export class HelpCommand extends BaseCommand {
  @Command.Path(`--help`)
  @Command.Path(`-h`)
  async execute() {
    this.context.stdout.write(this.cli.usage(null));
  }
}
