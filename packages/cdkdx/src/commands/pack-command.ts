import { Command } from 'clipanion';

import { BaseCommand } from './base-command';

export class PackCommand extends BaseCommand {
  @Command.Path(`pack`)
  async execute() {
    
    this.context.stdout.write(`pack`);
  }
}
