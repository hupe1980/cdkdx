import { Command } from 'clipanion';

import { Docgen, TscDocgen, JsiiDocgen } from '../docgen';
import { ProjectCommand } from './project-command';

export class DocgenCommand extends ProjectCommand {
  @Command.Path('docgen')
  async execute(): Promise<number> {
    const docgen = this.getDocgen();

    await docgen.generate({
      projectPath: this.projectInfo.projectPath,
      typescriptExcludes: this.projectInfo.typescriptExcludes,
    });

    return 0;
  }

  private getDocgen(): Docgen {
    if (this.projectInfo.isJsii) {
      return new JsiiDocgen();
    }
    return new TscDocgen();
  }
}
