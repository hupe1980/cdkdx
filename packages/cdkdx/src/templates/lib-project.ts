import { Semver } from '../semver';
import { Project, ProjectOptions } from './project';

export class LibProject extends Project {
  constructor(options: ProjectOptions) {
    super(options);

    this.addScripts({
      package: 'cdkdx package',
      ['release:npm']: 'cdkdx release npm',
    });

    this.addFields({
      main: `${this.outDir}/index.js`,
      types: `${this.outDir}/index.d.ts`,
      files: ['lib'],
    });

    this.addPeerDependencies(
      {
        '@aws-cdk/aws-lambda': options.dependencyVersions['@aws-cdk/core'],
        '@aws-cdk/core': options.dependencyVersions['@aws-cdk/core'],
      },
      {
        pinnedDevDependency: false,
      },
    );

    this.addDependencies({
      '@aws-cdk/aws-lambda': options.dependencyVersions['@aws-cdk/core'],
      '@aws-cdk/core': options.dependencyVersions['@aws-cdk/core'],
    });

    this.addDevDependencies({
      '@aws-cdk/assert': options.dependencyVersions['@aws-cdk/core'],
      '@types/node': Semver.caret(this.minNodeVersion),
      cdkdx: options.dependencyVersions['cdkdx'],
    });

    this.gitignore.exclude('dist');

    this.addFiles([
      'API.md',
      'README.md',
      'src/index.ts',
      'src/${name}.ts',
      'src/__tests__/${name}.test.ts',
      'src/lambdas/demo/index.ts',
    ]);
  }
}
