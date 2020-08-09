import * as path from 'path';
import * as fs from 'fs-extra';
import { Command } from 'clipanion';
import execa from 'execa';
import latestVersion from 'latest-version';

import * as Messages from '../messages';
import { Semver } from '../semver';
import {
  Project,
  ProjectOptions,
  AppProject,
  LibProject,
  JsiiLibProject,
} from '../templates';
import { BaseCommand } from '../base-command';

export class CreateCommand extends BaseCommand {
  static usage = Command.Usage({
    description: 'Create a new, empty CDK project from a template',
    details: `
            This command will create a new, empty CDK project from a template.
        `,
    examples: [
      ['Create a cdk app', 'npx cdkdx create app my-app'],
      ['Create a cdk lib', 'npx cdkdx create lib my-lib'],
      ['Create a jsii cdk lib', 'npx cdkdx create jsii-lib my-lib'],
    ],
  });

  @Command.String({ required: true })
  public type!: 'lib' | 'jsii-lib' | 'app';

  @Command.String({ required: true })
  public name!: string;

  @Command.Path('create')
  async execute(): Promise<number> {
    const targetPath = await this.getTargetPath(
      path.join(this.context.cwd, this.name),
    );

    const project = await this.createProject(targetPath);

    project.synth();

    await this.installDependencies(targetPath, project.getDependencyNames());

    this.context.stdout.write(Messages.creationComplete(this.name));

    return 0;
  }

  private async getTargetPath(targetPath: string): Promise<string> {
    if (await fs.pathExists(targetPath)) {
      throw new Error(
        `A folder named ${this.name} already exists! Choose a different name`,
      );
    }
    return targetPath;
  }

  private async createProject(targetPath: string): Promise<Project> {
    const cdkVersion = await latestVersion('@aws-cdk/core');

    const sourceMapSupportVersion = await latestVersion('source-map-support');

    const author = await this.getAuthor();

    const project = ((options: ProjectOptions): Project => {
      switch (this.type) {
        case 'app':
          return new AppProject(options);
        case 'lib':
          return new LibProject(options);
        case 'jsii-lib':
          return new JsiiLibProject(options);
        default:
          throw new Error(`Unknown project type: ${this.type}`);
      }
    })({
      name: this.name,
      template: 'default',
      author,
      dependencyVersions: {
        cdkdx: Semver.caret(this.context.version),
        '@aws-cdk/core': Semver.caret(cdkVersion),
        'source-map-support': Semver.caret(sourceMapSupportVersion),
      },
      targetPath,
    });

    return project;
  }

  private async getAuthor(): Promise<string> {
    const { stdout } = await execa('git', ['config', '--global', 'user.name']);
    return stdout.trim() || 'TODO_ADD_AUTHOR';
  }

  private async getInstallCommand(): Promise<{
    command: 'yarn' | 'npm';
    args: string[];
  }> {
    try {
      await execa('yarn', ['--version']);
      return { command: 'yarn', args: [] };
    } catch (_e) {
      return { command: 'npm', args: ['i'] };
    }
  }

  private async installDependencies(
    targetPath: string,
    dependencyNames: string[],
  ): Promise<void> {
    this.context.done(`Installing dependencies: ${dependencyNames.join(',')}`);

    const { command, args } = await this.getInstallCommand();

    await execa(command, args, {
      cwd: targetPath,
      stdio: ['ignore', 'inherit', 'inherit'],
    });

    this.context.done(`Dependencies installed.\n`);
  }

  // private async isInGitRepository(targetPath: string): Promise<boolean> {
  //   try {
  //     await execa('git', ['rev-parse', '--is-inside-work-tree'], {
  //       cwd: targetPath,
  //       stdio: 'ignore',
  //     });
  //     return true;
  //   } catch (e) {
  //     return false;
  //   }
  // }
}
