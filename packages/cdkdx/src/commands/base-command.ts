import { Command, BaseContext } from 'clipanion';

export type CommandContext = BaseContext & {
  cwd: string;
};

export abstract class BaseCommand extends Command<CommandContext> {
  abstract execute(): Promise<number | void>;
}

