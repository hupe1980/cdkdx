import { Command } from 'clipanion';
import * as jest from 'jest';
import tsjPreset from 'ts-jest/presets';

import { BaseProjectCommand } from '../base-command';
import { ProjectInfo } from '../project-info';
import { TsConfig } from '../ts-config';
export class TestCommand extends BaseProjectCommand {
  static usage = Command.Usage({
    description: 'Run jest test runner',
    details: `
            All flags are passed through directly to jest.
        `,
    examples: [
      ['Run jest', 'cdkdx test'],
      ['Run jest in watch mode', 'cdkdx test --watch'],
    ],
  });

  @Command.Proxy()
  public jestArgv!: string[];

  @Command.Path('test')
  async execute(): Promise<number> {
    process.env.NODE_ENV = 'test';
    process.env.LAMBDAS = this.projectInfo.lambdasSrcPath;

    const argv: string[] = [];

    const projects: Record<string, unknown>[] = [];

    if (this.projectInfo.workspaces) {
      const infos = await this.projectInfo.getWorkspaceProjectInfos();

      // TODO Remove isolatedModules? See https://github.com/kulshekhar/ts-jest/issues/1967
      if (infos) {
        for (const info of infos) {
          projects.push(this.createCdkProjectConfig(info, true));

          if (await info.hasLambdaSrc()) {
            projects.push(this.createLambdaProjectConfig(info, true));
          }
        }
      }
    } else {
      projects.push(this.createCdkProjectConfig(this.projectInfo));

      if (await this.projectInfo.hasLambdaSrc()) {
        projects.push(this.createLambdaProjectConfig(this.projectInfo));
      }
    }

    const jestConfig = {
      collectCoverageFrom: ['src/**/*.ts', '!src/**/*.(spec|test).ts'],
      watchPlugins: [
        require.resolve('jest-watch-typeahead/filename'),
        require.resolve('jest-watch-typeahead/testname'),
        require.resolve('jest-watch-select-projects'),
      ],
      projects,
    };

    argv.push('--config', JSON.stringify(jestConfig));

    argv.push(...this.jestArgv);

    await jest.run(argv);

    return 0;
  }

  private createCdkProjectConfig(info: ProjectInfo, isolatedModules = false) {
    return {
      displayName: { name: `${info.name} [cdk]`, color: 'white' },
      rootDir: info.root,
      transform: {
        ...tsjPreset.defaults.transform,
        '.+\\.(css|html)$': require.resolve('jest-transform-stub'),
      },
      moduleFileExtensions: ['ts', 'js', 'json', 'html'],
      testMatch: [`/**/*.(spec|test).ts`],
      testPathIgnorePatterns: [info.lambdasSrcPath],
      testEnvironment: 'node',
      globals: {
        'ts-jest': {
          tsconfig: TsConfig.fromJsiiTemplate().getCompilerOptions(),
          isolatedModules,
        },
      },
    };
  }

  private createLambdaProjectConfig(
    info: ProjectInfo,
    isolatedModules = false,
  ) {
    return {
      displayName: { name: `${info.name} [lambda]`, color: 'white' },
      rootDir: info.lambdasSrcPath,
      transform: {
        ...tsjPreset.defaults.transform,
        '.+\\.(css|html)$': require.resolve('jest-transform-stub'),
      },
      moduleFileExtensions: ['ts', 'js', 'json', 'html'],
      testMatch: [`/**/*.(spec|test).ts`],
      testEnvironment: 'node',
      globals: {
        'ts-jest': {
          tsconfig: TsConfig.fromLambdaTemplate().getCompilerOptions(),
          isolatedModules,
        },
      },
    };
  }
}
