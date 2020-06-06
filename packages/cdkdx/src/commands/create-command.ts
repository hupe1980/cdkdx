import * as path from 'path';
import * as fs from 'fs-extra';
import { Command } from 'clipanion';
import execa from 'execa';
import { Input } from 'enquirer';
import latestVersion from 'latest-version';
import ora from 'ora';

import { Context } from '../context';
import { Template, TemplateContext } from '../template';
import * as Messages from '../messages';
import { getInstallCommand, getAuthor } from '../utils';

export class CreateCommand extends Command<Context> {
  @Command.String({ required: true })
  public type!: 'lib' | 'app';

  @Command.String({ required: true })
  public name!: string;

  @Command.String('--compiler')
  public compiler = 'tsc';

  @Command.String('--template')
  public templateName = 'default';

  @Command.Path('create')
  async execute(): Promise<number> {
    const targetPath = await this.getTargetPath(
      path.join(this.context.cwd, this.name)
    );

    const cdkVersion = await latestVersion('@aws-cdk/core');

    const author = await getAuthor();

    const template = new Template({
      cdkdxVersion: this.context.version,
      cdkVersion,
      type: this.type,
      templateName: this.templateName,
      name: this.name,
      author,
      compiler: this.compiler as TemplateContext['compiler'],
    });

    try {
      await this.initializeProject(targetPath, template);
      
      process.chdir(targetPath);
      
      await this.installDependencies(template.dependencyNames);
    } catch (error) {
      return 1;
    }

    this.context.stdout.write(Messages.creationComplete(this.name));
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

  private async initializeProject(targetPath: string, template: Template): Promise<void> {
    const templateSpinner = ora({
      text: `Initializing project ${this.name} with template ${this.templateName}`,
      stream: this.context.stdout,
    }).start();

    try {
      await template.install(targetPath);
      templateSpinner.succeed('Project initialized');
    } catch (error) {
      templateSpinner.fail('Failed to initialize project');
      throw error;
    }
  }

  private async installDependencies(dependencyNames: string[]): Promise<void> {
    const spinner = ora({
      text: Messages.installingDependencies(dependencyNames.sort()),
      stream: this.context.stdout,
    }).start();

    try {
      const { command, args } = await getInstallCommand();
      await execa(command, args);
      spinner.succeed('Dependencies installed');
    } catch (error) {
      spinner.fail('Failed to install dependencies');
      throw error;
    } 
  }
}
