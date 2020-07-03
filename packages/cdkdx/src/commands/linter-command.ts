//import * as path from 'path';
import { Command } from 'clipanion';
import { CLIEngine } from 'eslint';

//import { TsConfig } from '../ts-config';
import { ProjectCommand } from './project-command';

export class LinterCommand extends ProjectCommand {
  @Command.Boolean('--fix')
  public fix = false;

  @Command.Boolean('--report-unused-disable-directives')
  public reportUnusedDisableDirectives = false;

  @Command.Path('lint')
  async execute(): Promise<number> {
    //const eslintTypeScriptConfigPath = path.join(this.context.cwd, 'tsconfig.eslint.json');

    // const tsConfig = new TsConfig({
    //   include: ['src'],
    // });
    
    //await tsConfigBuilder.writeJson(eslintTypeScriptConfigPath);

    const cli = new CLIEngine({
      baseConfig: {
        extends: 'cdk',
        // parserOptions: {
        //   ecmaVersion: '2018',
        //   sourceType: 'module',
        //   project: eslintTypeScriptConfigPath,
        // },
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
}
