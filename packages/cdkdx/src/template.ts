import * as path from 'path';
import * as fs from 'fs-extra';
import execa from 'execa';
import latestVersion from 'latest-version';
import { Semver } from './semver';
import {
  Project,
  ProjectOptions,
  AppProject,
  LibProject,
  JsiiLibProject,
} from './templates';

const TEMPLATES_PATH = path.join(__dirname, '..', 'templates');

export interface TemplateProps {
  type: 'lib' | 'jsii-lib' | 'app';
  name: string;
  version: string;
  cwd: string;
}

export class Template {
  public static async newInstance(props: TemplateProps): Promise<Template> {
    const targetPath = path.join(props.cwd, props.name);

    if (await fs.pathExists(targetPath)) {
      throw new Error(
        `A folder named ${props.name} already exists! Choose a different name`,
      );
    }

    const cdkVersion = await latestVersion('@aws-cdk/core');

    const sourceMapSupportVersion = await latestVersion('source-map-support');

    const author = await Template.getAuthor();

    const project = ((options: ProjectOptions): Project => {
      switch (props.type) {
        case 'app':
          return new AppProject(options);
        case 'lib':
          return new LibProject(options);
        case 'jsii-lib':
          return new JsiiLibProject(options);
        default:
          throw new Error(`Unknown project type: ${props.type}`);
      }
    })({
      name: props.name,
      template: path.join(TEMPLATES_PATH, props.type, 'default'),
      author,
      dependencyVersions: {
        cdkdx: Semver.caret(props.version),
        '@aws-cdk/core': Semver.caret(cdkVersion),
        'source-map-support': Semver.caret(sourceMapSupportVersion),
      },
      targetPath,
    });

    return new Template(project);
  }

  private static async getAuthor(): Promise<string> {
    const { stdout } = await execa('git', ['config', '--global', 'user.name']);
    return stdout.trim() || 'TODO_ADD_AUTHOR';
  }

  private constructor(private readonly project: Project) {}

  public createProject(): void {
    this.project.synth();
  }

  public getDependencyNames(): string[] {
    return this.project.getDependencyNames();
  }

  public async installDependencies(): Promise<void> {
    const { command, args } = await this.getInstallCommand();

    await execa(command, args, {
      cwd: this.project.targetPath,
      stdio: ['ignore', 'inherit', 'inherit'],
    });
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
