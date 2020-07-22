import * as path from 'path';
import * as fs from 'fs-extra';
import { Command } from 'clipanion';
import { renderSinglePageModule } from 'jsii-docgen';

import { ProjectCommand } from './project-command';

export class DocgenCommand extends ProjectCommand {
  @Command.Path('docgen')
  async execute(): Promise<number> {
    if (!this.projectInfo.isJsii) {
      this.context.stdout.write('⚠️ No jsii docgen for tsc projects.\n\n');
      return 0;
    }

    if (!fs.existsSync(path.join(this.projectInfo.projectPath, '.jsii'))) {
      throw new Error('File .jsii is missing! Please run cdkdx build first.');
    }

    await renderSinglePageModule(this.projectInfo.projectPath, 'API.md');

    return 0;
  }
}
