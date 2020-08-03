import * as path from 'path';
import * as fs from 'fs-extra';
import { Command } from 'clipanion';
import { ESLint } from 'eslint';

import { TsConfig } from '../ts-config';
import { ProjectCommand } from './project-command';

export class LinterCommand extends ProjectCommand {
  static usage = Command.Usage({
    description: 'Run eslint with prettier',
    details: `
            This command runs eslint with prettier.
        `,
    examples: [
      ['Run linting', 'cdkdx lint'],
      ['Fixe fixable errors and warnings ', 'cdkdx lint --fix'],
    ],
  });

  @Command.Boolean('--fix')
  public fix = false;

  @Command.Boolean('--cache')
  public cache = false;

  @Command.Boolean('--report-unused-disable-directives')
  public reportUnusedDisableDirectives = false;

  @Command.Path('lint')
  async execute(): Promise<number> {
    const eslintTypeScriptConfigPath = path.join(
      this.projectInfo.projectPath,
      'tsconfig.eslint.json',
    );

    const tsConfig = TsConfig.fromJsiiTemplate({
      include: this.projectInfo.workspaces?.map((ws) => `${ws}/src`) ?? ['src'],
    });

    await tsConfig.writeJson(eslintTypeScriptConfigPath, {
      overwriteExisting: true,
    });

    if (this.projectInfo.workspaces) {
      await Promise.all(
        this.projectInfo.workspaces.map((ws) => {
          const lamdasSrcPath = path.join(ws, 'src', 'lambdas');

          return this.createLambdasEslintTsConfig(lamdasSrcPath);
        }),
      );
    } else {
      await this.createLambdasEslintTsConfig(this.projectInfo.lambdasSrcPath);
    }

    const eslint = new ESLint({
      baseConfig: {
        extends: 'cdk',
      },
      cwd: this.projectInfo.projectPath,
      fix: this.fix,
      cache: this.cache,
      reportUnusedDisableDirectives: this.reportUnusedDisableDirectives
        ? 'off'
        : 'error',
    });

    const results = await eslint.lintFiles(['*/**/*.ts']);

    if (this.fix) {
      await ESLint.outputFixes(results);
    }

    const formatter = await eslint.loadFormatter('stylish');

    const resultText = formatter.format(results);

    this.context.stdout.write(resultText);

    const errorCount = results.reduce(
      (acc, { errorCount }) => acc + errorCount,
      0,
    );

    return errorCount === 0 ? 0 : 1;
  }

  private async createLambdasEslintTsConfig(
    lambdasSrcPath: string,
  ): Promise<void> {
    if (!(await fs.pathExists(lambdasSrcPath))) return;

    const tsLambdaConfig = TsConfig.fromLambdaTemplate({
      include: ['**/*.ts'],
    });

    await tsLambdaConfig.writeJson(
      path.join(lambdasSrcPath, 'tsconfig.eslint.json'),
      {
        overwriteExisting: true,
      },
    );
  }
}
