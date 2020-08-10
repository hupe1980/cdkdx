import { Command } from 'clipanion';
import { BaseCommand } from '../base-command';

export class VersionCommand extends BaseCommand {
  @Command.Path(`--version`)
  @Command.Path(`-v`)
  async execute(): Promise<void> {
    this.context.logger.log(this.cli.binaryVersion ?? `<unknown>`);
  }
}
