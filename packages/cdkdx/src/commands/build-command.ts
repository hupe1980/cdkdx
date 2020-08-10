import * as fs from 'fs-extra';
import { Command } from 'clipanion';

import { BaseProjectCommand } from '../base-command';
import { Compiler, JsiiCompiler, TscCompiler } from '../compiler';
import { Timer } from '../timer';

export class BuildCommand extends BaseProjectCommand {
  static usage = Command.Usage({
    description: 'Build the project',
    details: `
            This command will bundle the lambdas and build the project.
        `,
    examples: [
      ['Build the project', 'cdkdx build'],
      ['Rebuilds on any change', 'cdkdx build -w'],
    ],
  });

  @Command.Boolean('--watch')
  @Command.Boolean('-w')
  public watch = false;

  @Command.Boolean('--minify-lambdas')
  public minifyLambdas = false;

  @Command.Path('build')
  async execute(): Promise<number> {
    const timer = new Timer();

    const bundleCommand = ['bundle'];

    if (this.watch) {
      bundleCommand.push('-w');
    }

    if (this.minifyLambdas) {
      bundleCommand.push('--minify');
    }

    await fs.remove(this.projectInfo.libPath);

    const bundleExitCode = await this.cli.run(bundleCommand);

    if (bundleExitCode !== 0) return bundleExitCode;

    const compiler = this.getCompiler();

    await compiler.compile({
      cwd: this.context.cwd,
      watch: this.watch,
      projectInfo: this.projectInfo,
    });

    timer.end();

    this.context.logger.done(
      `Project ${this.projectInfo.name} compiled in ${timer.display()}.\n`,
    );

    return 0;
  }

  private getCompiler(): Compiler {
    if (this.projectInfo.isJsii) {
      return new JsiiCompiler();
    }
    return new TscCompiler();
  }
}
