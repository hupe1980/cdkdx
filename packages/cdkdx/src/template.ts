import * as path from 'path';
import * as fs from 'fs-extra';
import latestVersion from 'latest-version';
import { Semver } from './semver';
import { PackageManager } from './package-manager';
import { GitRepository } from './git-repository';
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

    const constructsVersion = await latestVersion('constructs');

    const sourceMapSupportVersion = await latestVersion('source-map-support');

    const author = await Template.getAuthor(props.cwd);

    // jsii-lib uses the same template as lib
    const templateType = props.type === 'jsii-lib' ? 'lib' : props.type;

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
      template: path.join(TEMPLATES_PATH, templateType, 'default'),
      author,
      dependencyVersions: {
        cdkdx: Semver.caret(props.version),
        '@aws-cdk/core': Semver.caret(cdkVersion),
        constructs: Semver.caret(constructsVersion),
        'source-map-support': Semver.caret(sourceMapSupportVersion),
      },
      targetPath,
    });

    return new Template(project);
  }

  private static async getAuthor(cwd: string): Promise<string> {
    let author = 'TODO_ADD_AUTHOR';

    try {
      const git = new GitRepository(cwd);
      author = await git.getAuthor();
    } catch (e) {
      //nope;
    }

    return author;
  }

  private constructor(private readonly project: Project) {}

  public createProject(): void {
    this.project.synth();
  }

  public getDependencyNames(): string[] {
    return this.project.getDependencyNames();
  }

  public getTargetPath(): string {
    return this.project.targetPath;
  }

  public async installDependencies(): Promise<void> {
    const packageManager = new PackageManager();

    await packageManager.install({
      cwd: this.project.targetPath,
      stdio: ['ignore', 'inherit', 'inherit'],
    });
  }
}
