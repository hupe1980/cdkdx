import { Command } from 'clipanion';

import { Docgen, TscDocgen, JsiiDocgen } from '../docgen';
import { Timer } from '../timer';
import { BaseProjectCommand } from '../base-command';

export class DocgenCommand extends BaseProjectCommand {
  static usage = Command.Usage({
    description: 'Generate docs for the project',
    details: ``,
  });

  @Command.Path('docgen')
  async execute(): Promise<number> {
    const timer = new Timer();

    const docgen = this.getDocgen();

    await docgen.generate({
      projectPath: this.context.cwd,
      typescriptExcludes: this.projectInfo.typescriptExcludes,
    });

    timer.end();

    this.context.logger.done(`Docs created in ${timer.display()}.\n`);

    return 0;
  }

  private getDocgen(): Docgen {
    if (this.projectInfo.isJsii) {
      return new JsiiDocgen();
    }
    return new TscDocgen();
  }
}
