import { Semver } from '../semver';
import { Project, ProjectOptions } from './project';
import { JsonFile } from './json-file';

export class AppProject extends Project {
  constructor(options: ProjectOptions) {
    super(options);

    this.addScripts({
      build: 'cdkdx build',
      test: 'cdkdx test',
      lint: 'cdkdx lint',
      docgen: 'cdkdx docgen',
      cdk: 'cdk',
    });

    this.addDependencies({
      '@aws-cdk/core': options.dependencyVersions['@aws-cdk/core'],
      'source-map-support': options.dependencyVersions['source-map-support'],
    });

    this.addDevDependencies({
      '@aws-cdk/assert': options.dependencyVersions['@aws-cdk/core'],
      '@types/node': Semver.caret(this.minNodeVersion),
      'aws-cdk': options.dependencyVersions['@aws-cdk/core'],
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
