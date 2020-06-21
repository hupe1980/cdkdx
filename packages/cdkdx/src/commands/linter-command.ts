import { Command } from 'clipanion';
import { CLIEngine } from 'eslint';

import { ConstructCommand } from './construct-command';

export class LinterCommand extends ConstructCommand {
  @Command.Boolean('--fix')
  public fix = false;

  @Command.Boolean('--disable-awslint')
  public disableAwslint = false;

  @Command.Boolean('--report-unused-disable-directives')
  public reportUnusedDisableDirectives = false;

  @Command.Path('lint')
  async execute(): Promise<number> {
    const awslintErrorCode = this.disableAwslint ? 0 : await this.cli.run(['awslint']);

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

    return report.errorCount !== 0 || awslintErrorCode !== 0 ? 1 : 0;
  }

  private createEslintConfig(): CLIEngine.Options['baseConfig'] {
    return {
      extends: 'cdk',
    };
  }
}
