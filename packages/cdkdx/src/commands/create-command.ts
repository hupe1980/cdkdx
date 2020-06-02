import * as path from 'path';
import * as fs from 'fs-extra';
import { Command } from 'clipanion';
import execa from 'execa';
import { Input } from 'enquirer';
import latestVersion from 'latest-version';

import { Context } from '../context';
import { Template, TemplateContext } from '../template';
import { getInstallCommand, getAuthor } from '../utils';

export class CreateCommand extends Command<Context> {
  @Command.String({ required: true })
  public name: string;

  @Command.String('--compiler')
  public compiler = 'tsc';

  @Command.String('--template')
  public template = 'default';

  @Command.Path('create')
  async execute(): Promise<number> {
    const targetPath = await this.getTargetPath(
      path.join(this.context.cwd, this.name)
    );

    const cdkVersion = await latestVersion('@aws-cdk/core');

    const author = await getAuthor();

    const template = new Template(this.template, {
      cdkdxVersion: this.context.version,
      cdkVersion,
      name: this.name,
      author,
      compiler: this.compiler as TemplateContext['compiler'],
    });

    await template.install(targetPath);

    await this.installDependencies(targetPath);

    return 0;
  }

  private async getTargetPath(targetPath: string): Promise<string> {
    const exists = await fs.pathExists(targetPath);

    if (!exists) {
      return targetPath;
    }

    const prompt = new Input({
      message: `A folder named ${this.name} already exists! Choose a different name`,
      result: (value: string) => value.trim(),
    });

    this.name = await prompt.run();

    return this.getTargetPath(path.join(this.context.cwd, this.name));
  }

  private async installDependencies(targetPath: string): Promise<void> {
    process.chdir(targetPath);

    const { command, args } = await getInstallCommand();

    await execa(command, args);
  }
}
