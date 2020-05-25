import { Command } from 'clipanion';

import { Context } from '../context';

export class HelpCommand extends Command<Context> {
  @Command.Path('--help')
  @Command.Path('-h')
  async execute():Promise<number> {
    this.context.stdout.write(this.cli.usage(null));

    return 0;
  }
}
