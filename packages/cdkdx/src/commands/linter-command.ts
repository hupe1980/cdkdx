import { Command } from 'clipanion';
import { CLIEngine } from 'eslint';

import { ProjectCommand } from './project-command';

export class LinterCommand extends ProjectCommand {
  @Command.Boolean('--fix')
  public fix = false;

  @Command.Boolean('--report-unused-disable-directives')
  public reportUnusedDisableDirectives = false;

  @Command.Path('lint')
  async execute(): Promise<number> {
    const eslintConfig = this.createEslintConfig();

    const cli = new CLIEngine({
      baseConfig: {
        ...eslintConfig,
      },
      fix: this.fix,
      reportUnusedDisableDirectives: this.reportUnusedDisableDirectives,
    });

    const report = cli.executeOnFiles(['*/**/*.ts']);

    if (this.fix) {
      CLIEngine.outputFixes(report);
    }

    this.context.stdout.write(cli.getFormatter()(report.results));

    return report.errorCount === 0 ? 0 : 1;
  }

  private createEslintConfig(): CLIEngine.Options['baseConfig'] {
    return {
      extends: 'cdk',
    };
  }
}
