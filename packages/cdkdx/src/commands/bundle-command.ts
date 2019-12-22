import { Command } from 'clipanion';

import { BaseCommand } from './base-command';

export class BundleCommand extends BaseCommand {
  @Command.Path(`bundle`)
  async execute() {
    this.context.stdout.write(`blabundle`);
  }
}
