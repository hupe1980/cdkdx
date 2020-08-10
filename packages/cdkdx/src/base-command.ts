import { Command, BaseContext } from 'clipanion';

import { ProjectInfo } from './project-info';
import { Logger } from './logger';

export interface CommandContext extends BaseContext {
  cwd: string;
  version: string;
  logger: Logger;
}

export abstract class BaseCommand extends Command<CommandContext> {}

export abstract class BaseProjectCommand extends BaseCommand {
  protected readonly projectInfo: ProjectInfo;

  constructor() {
    super();
    this.projectInfo = new ProjectInfo(process.cwd());
  }
}
