import { Command } from 'clipanion';

import { Docgen, TscDocgen } from '../docgen';
import { Timer } from '../timer';
import { BaseProjectCommand } from '../base-command';

export class DocgenCommand extends BaseProjectCommand {
  static usage = Command.Usage({
    description: 'Generate docs for the project',
    details: ``,
  });

  @Command.Path('docgen')
  async execute(): Promise<number> {
    if (!this.projectInfo.isConstructLib) {
      this.context.logger.warn('No docgen for apps.\n');
      return 0;
    }

    const timer = new Timer();

    const docgen = this.getDocgen();

    this.context.logger.log(``);

    await docgen.generate({
      projectPath: this.context.cwd,
      typescriptExcludes: this.projectInfo.typescriptExcludes,
      logger: this.context.logger,
    });

    timer.end();

    this.context.logger.log(``);
    this.context.logger.done(`Docs created in ${timer.display()}.\n`);

    return 0;
  }

  private getDocgen(): Docgen {
    return new TscDocgen();
  }
}
