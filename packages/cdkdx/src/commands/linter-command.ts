import * as path from 'path';
import { Command } from 'clipanion';
import { ESLint } from 'eslint';

import { TsConfig } from '../ts-config';
import { BaseProjectCommand } from '../base-command';

export class LinterCommand extends BaseProjectCommand {
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
      this.context.cwd,
      'tsconfig.eslint.json',
    );

    let include: string[] = [];
    if (this.projectInfo.workspaces) {
      this.projectInfo.workspaces.forEach((ws) => {
        include.push(`${ws}/src/**/*.ts`);
        include.push(`${ws}/src/**/*.tsx`);
      });
    } else {
      include = ['src/**/*.ts', 'src/**/*.tsx'];
    }

    const tsConfig = TsConfig.fromJsiiTemplate({
      include,
    });

    await tsConfig.writeJson(eslintTypeScriptConfigPath, {
      overwriteExisting: true,
    });

    const eslint = new ESLint({
      baseConfig: {
        extends: 'cdk',
      },
      cwd: this.context.cwd,
      fix: this.fix,
      cache: this.cache,
      reportUnusedDisableDirectives: this.reportUnusedDisableDirectives
        ? 'off'
        : 'error',
    });

    const results = await eslint.lintFiles(['*/**/*.{ts,tsx}']);

    if (this.fix) {
      await ESLint.outputFixes(results);
    }

    const formatter = await eslint.loadFormatter('stylish');

    const resultText = await formatter.format(results);

    this.context.logger.log(resultText);

    const errorCount = results.reduce(
      (acc, { errorCount }) => acc + errorCount,
      0,
    );

    return errorCount === 0 ? 0 : 1;
  }
}
