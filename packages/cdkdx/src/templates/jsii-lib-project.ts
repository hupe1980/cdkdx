import { ProjectOptions } from './project';
import { LibProject } from './lib-project';

export class JsiiLibProject extends LibProject {
  constructor(options: ProjectOptions) {
    super(options);

    this.addScripts({
      ['release:pypi']: 'cdkdx release pypi',
    });

    this.addFields({
      files: ['lib', '.jsii'],
      jsii: {
        outdir: 'dist',
        tsc: {
          outDir: this.outDir,
          rootDir: this.srcDir,
        },
        excludeTypescript: [
          `${this.srcDir}/lambdas`,
          `${this.srcDir}/**/__tests__`,
        ],
        targets: {
          python: {
            distName: options.name,
            module: options.name.replace('-', '_'),
          },
        },
      },
    });

    this.addPeerDependencies(
      {
        constructs: options.dependencyVersions['constructs'],
      },
      {
        pinnedDevDependency: false,
      },
    );

    this.gitignore.exclude('.jsii');
  }
}
