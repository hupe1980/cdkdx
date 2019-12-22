import { Command } from 'clipanion';

import { CommandContext } from './plugin';

export abstract class BaseCommand extends Command<CommandContext> {
  abstract execute(): Promise<number | void>;
}
