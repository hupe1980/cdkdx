import { Command, BaseContext } from 'clipanion';

import { ProjectInfo } from './project-info';

export interface CommandContext extends BaseContext {
  cwd: string;
  version: string;
  log: (message: string) => void;
  done: (message: string) => void;
}

export abstract class BaseCommand extends Command<CommandContext> {}

export abstract class BaseProjectCommand extends BaseCommand {
  protected readonly projectInfo: ProjectInfo;

  constructor() {
    super();
    this.projectInfo = new ProjectInfo(process.cwd());
  }
}
