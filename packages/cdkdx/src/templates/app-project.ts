import { Project, ProjectOptions } from './project';
import { Semver } from './semver';
import { JsonFile } from './json-file';

export class AppProject extends Project {
  constructor(options: ProjectOptions) {
    super('app', options);

    this.addScripts({
      build: 'cdkdx build',
      test: 'cdkdx test',
      lint: 'cdkdx lint',
      cdk: 'cdk',
    });

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

    new JsonFile(this, 'cdk.json', {
      obj: {
        app: `cdkdx node src/${options.name}-app.ts`,
        context: {
          '@aws-cdk/core:enableStackNameDuplicates': 'true',
          'aws-cdk:enableDiffNoFail': 'true',
        },
      },
    });

    this.addFiles([
      'README.md',
      'src/${name}-app.ts',
      'src/${name}-stack.ts',
      'src/lambdas',
      'src/__tests__/${name}-stack.test.ts',
    ]);
  }
}
