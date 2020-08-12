import * as path from 'path';
import * as fs from 'fs-extra';
import camelCase from 'camelcase';
import { Construct, Node } from 'constructs';

import { Semver } from '../semver';
import { TemplateFile } from './template-file';
import { Directory } from './directory';
import { JsonFile } from './json-file';
import { GitIgnore } from './git-ignore';

const DEFAULT_JSII_MIN_NODE = '10.17.0';

export interface ProjectOptions {
  readonly targetPath: string;
  readonly name: string;
  readonly template: string;
  readonly author: string;
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
  public readonly gitignore: GitIgnore;

  private readonly scripts: Record<string, string> = {};
  private readonly peerDependencies: Record<string, string> = {};
  private readonly devDependencies: Record<string, string> = {};
  private readonly dependencies: Record<string, string> = {};
  private readonly manifest: Record<string, unknown>;
  private readonly templateContext: Record<string, unknown>;

  constructor(options: ProjectOptions) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(undefined as any, 'cdkdx');

    this.targetPath = options.targetPath;

    this.template = options.template;
    this.minNodeVersion = options.minNodeVersion ?? DEFAULT_JSII_MIN_NODE;

    this.srcDir = options.srcDir ?? 'src';
    this.outDir = options.outDir ?? 'lib';

    const description = 'TODO: Add your description here';

    this.manifest = {
      name: options.name,
      version: '0.1.0',
      description,
      license: 'MIT',
      author: {
        name: options.author,
        url: `https://github.com/${options.author}`,
      },
      engines: { node: `>= ${this.minNodeVersion}` },
      main: undefined,
      types: undefined,
      files: undefined,
      jsii: undefined,
      scripts: this.scripts,
      peerDependencies: this.peerDependencies,
      dependencies: this.dependencies,
      devDependencies: this.devDependencies,
      eslintConfig: {
        extends: ['cdk'],
      },
    };

    new JsonFile(this, 'package.json', {
      obj: this.manifest,
    });

    this.gitignore = new GitIgnore(this);
    this.addDefaultGitIgnoreExcludes();

    this.addScripts({
      build: 'cdkdx build',
      watch: 'cdkdx build -w',
      test: 'cdkdx test',
      lint: 'cdkdx lint',
      ['upgrade:cdk']: 'cdkdx upgrade-cdk',
      docgen: 'cdkdx docgen',
    });

    this.templateContext = {
      name: options.name,
      description,
      camelCase: (str: string) => camelCase(str),
      pascalCase: (str: string) => camelCase(str, { pascalCase: true }),
    };
  }

  public addFields(fields: { [name: string]: unknown }): void {
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
    options: PeerDependencyOptions = {},
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
    const templatePath = fromPath ?? this.template;

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

  private addDefaultGitIgnoreExcludes() {
    this.gitignore.exclude(
      '# Logs',
      'logs',
      '*.log',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      'lerna-debug.log*',
      '',
      '# Diagnostic reports (https://nodejs.org/api/report.html)',
      'report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json',
      '',
      '# Runtime data',
      'pids',
      '*.pid',
      '*.seed',
      '*.pid.lock',
      '',
      '# Directory for instrumented libs generated by jscoverage/JSCover',
      'lib-cov',
      '',
      '# Coverage directory used by tools like istanbul',
      'coverage',
      '*.lcov',
      '',
      '# nyc test coverage',
      '.nyc_output',
      '',
      '# Grunt intermediate storage(https://gruntjs.com/creating-plugins#storing-task-files)',
      '.grunt',
      '',
      '# Bower dependency directory(https://bower.io/)',
      'bower_components',
      '',
      '# node-waf configuration',
      '.lock-wscript',
      '',
      '# Compiled binary addons (https://nodejs.org/api/addons.html)',
      'build/Release',
      '',
      '# Dependency directories',
      'node_modules/',
      'jspm_packages/',
      '',
      '# TypeScript v1 declaration files',
      'typings/',
      '',
      '# Optional npm cache directory',
      '.npm',
      '',
      '# Optional eslint cache',
      '.eslintcache',
      '',
      '# Optional REPL history',
      '.node_repl_history',
      '',
      '# Output of `npm pack`',
      '*.tgz',
      '',
      '# Yarn Integrity file',
      '.yarn-integrity',
      '',
      '# dotenv environment variables file',
      '.env',
      '',
      '# next.js build output',
      '.next',
      '',
      '# cdkdx',
      '.DS_Store',
      'lib',
      '*.tsbuildinfo',
      'tsconfig.json',
      'tsconfig.eslint.json',
    );
  }
}
