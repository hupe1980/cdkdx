import { Command } from 'clipanion';
import { CLIEngine } from 'eslint';

import { ConstructCommand } from './construct-command';

export class LinterCommand extends ConstructCommand {
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

    if (report.errorCount) {
      return 1;
    }

    return 0;
  }

  private createEslintConfig(): CLIEngine.Options['baseConfig'] {
    return {
      extends: 'cdk',
    };
  }
}
