import { Project, ProjectOptions } from './project';
import { Semver } from './semver';

export class LibProject extends Project {
  constructor(options: ProjectOptions) {
    super('lib', options);

    this.addScripts({
      build: 'cdkdx build',
      test: 'cdkdx test',
      lint: 'cdkdx lint',
      package: 'cdkdx package',
    });

    this.addFields({
      main: `${this.outDir}/index.js`,
      types: `${this.outDir}/index.d.ts`,
    });

    if (options.isJsii) {
      this.addFields({
        jsii: {
          outdir: 'dist',
          tsc: {
            outDir: this.outDir,
          },
          excludeTypescript: ['src/lambdas', 'src/**/__tests__'],
          targets: {
            python: {
              distName: options.name,
              module: options.name.replace('-', '_'),
            },
          },
        },
      });
    }

    this.addPeerDependencies(
      {
        '@aws-cdk/aws-lambda': options.dependencyVersions['@aws-cdk/core'],
        '@aws-cdk/core': options.dependencyVersions['@aws-cdk/core'],
      },
      {
        pinnedDevDependency: false,
      }
    );

    this.addDependencies({
      '@aws-cdk/aws-lambda': options.dependencyVersions['@aws-cdk/core'],
      '@aws-cdk/core': options.dependencyVersions['@aws-cdk/core'],
    });

    this.addDevDependencies({
      '@aws-cdk/assert': options.dependencyVersions['@aws-cdk/core'],
      '@types/aws-lambda': options.dependencyVersions['@types/aws-lambda'],
      '@types/node': Semver.caret(this.minNodeVersion),
      cdkdx: options.dependencyVersions['cdkdx'],
    });

    this.addFiles([
      'README.md',
      'src/index.ts',
      'src/${name}.ts',
      'src/__tests__/${name}.test.ts',
      'src/lambdas/demo/index.ts',
    ]);
  }
}
