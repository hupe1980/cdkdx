import * as path from 'path';
import * as fs from 'fs-extra';
import camelCase from 'camelcase';
import { Construct, Node } from 'constructs';

import { TemplateFile } from './template-file';
import { Directory } from './directory';
import { JsonFile } from './json-file';
import { Semver } from './semver';

const DEFAULT_JSII_MIN_NODE = '10.17.0';
const TEMPLATES_PATH = path.join(__dirname, '..', '..', 'templates');

export interface ProjectOptions {
  readonly targetPath: string;
  readonly name: string;
  readonly template: string;
  readonly author: string;
  readonly isJsii: boolean;
  readonly dependencyVersions: Record<string, Semver>;

  readonly srcDir?: string;
  readonly outDir?: string;

  readonly minNodeVersion?: string;
}

export interface PeerDependencyOptions {
  /**
   * Automatically add a pinned dev dependency.
   * @default true
   */
  readonly pinnedDevDependency?: boolean;
}

export class Project extends Construct {
  public readonly targetPath: string;
  public readonly template: string;
  public readonly minNodeVersion: string;
  public readonly outDir: string;
  public readonly srcDir: string;

  private readonly scripts: Record<string, string> = {};
  private readonly peerDependencies: Record<string, string> = {};
  private readonly devDependencies: Record<string, string> = {};
  private readonly dependencies: Record<string, string> = {};
  private readonly manifest: Record<string, unknown>;
  private readonly templateContext: Record<string, unknown>;

  constructor(public readonly type: string, options: ProjectOptions) {
    super(undefined as any, 'cdkdx');

    this.targetPath = options.targetPath;

    this.template = options.template;
    this.minNodeVersion = options.minNodeVersion ?? DEFAULT_JSII_MIN_NODE;

    this.srcDir = options.srcDir ?? 'src';
    this.outDir = options.outDir ?? 'lib';

    this.manifest = {
      name: options.name,
      version: '0.1.0',
      license: 'MIT',
      author: options.author,
      engines: { node: `>= ${this.minNodeVersion}` },
      main: undefined,
      types: undefined,
      jsii: undefined,
      scripts: this.scripts,
      peerDependencies: this.peerDependencies,
      dependencies: this.dependencies,
      devDependencies: this.devDependencies,
      eslintConfig: {
        extends: ['cdk']
      }
    };

    new JsonFile(this, 'package.json', {
      obj: this.manifest,
    });

    this.templateContext = {
      name: options.name,
      camelCase: (str: string) => camelCase(str),
      pascalCase: (str: string) => camelCase(str, { pascalCase: true }),
    };
  }

  public addFields(fields: { [name: string]: any }): void {
    for (const [name, value] of Object.entries(fields)) {
      this.manifest[name] = value;
    }
  }

  public addScripts(scripts: { [name: string]: string }): void {
    for (const [name, command] of Object.entries(scripts)) {
      this.scripts[name] = command;
    }
  }

  public addPeerDependencies(
    deps: { [module: string]: Semver },
    options: PeerDependencyOptions = {}
  ): void {
    const pinnedDevDependency = options.pinnedDevDependency ?? true;

    for (const [k, v] of Object.entries(deps)) {
      this.peerDependencies[k] = v.spec;

      if (pinnedDevDependency) {
        this.addDevDependencies({ [k]: Semver.pinned(v.version) });
      }
    }
  }

  public addDependencies(deps: { [module: string]: Semver }): void {
    for (const [k, v] of Object.entries(deps)) {
      this.dependencies[k] = v.spec;
    }
  }

  public addDevDependencies(deps: { [module: string]: Semver }): void {
    for (const [k, v] of Object.entries(deps ?? {})) {
      this.devDependencies[k] = v.spec;
    }
  }

  public addFiles(files: string[], fromPath?: string): void {
    const templatePath = fromPath ?? path.join(TEMPLATES_PATH, this.type, this.template);

    files.forEach((file) => {
      const sourceFile = path.join(templatePath, file);
      const stats = fs.statSync(sourceFile);

      if (stats.isDirectory()) {
        new Directory(this, file);
      } else {
        const template = fs.readFileSync(sourceFile, {
          encoding: 'utf-8',
        });

        new TemplateFile(this, file, {
          template,
          context: this.templateContext,
        });
      }
    });
  }

  public getDependencyNames(): string[] {
    const dependencyNames = new Set<string>([
      ...Object.keys(this.dependencies),
      ...Object.keys(this.devDependencies),
    ]);

    return [...dependencyNames];
  }

  public synth(): void {
    Node.of(this).synthesize({ outdir: this.targetPath });
  }
}