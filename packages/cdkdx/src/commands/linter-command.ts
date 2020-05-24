import { Command } from 'clipanion';
import { CLIEngine } from 'eslint';

import { Context } from '../context';

export class LinterCommand extends Command<Context> {
  @Command.Boolean(`--fix`)
  public fix: boolean = false;

  @Command.Boolean(`--report-unused-disable-directives`)
  public reportUnusedDisableDirectives: boolean = false;

  @Command.Path(`lint`)
  async execute() {
    const eslintConfig = this.createEslintConfig();

    const cli = new CLIEngine({
      baseConfig: {
        ...eslintConfig
      },
      fix: this.fix,
      reportUnusedDisableDirectives: this.reportUnusedDisableDirectives
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
      extends: 'cdk'
    };
  }
}
