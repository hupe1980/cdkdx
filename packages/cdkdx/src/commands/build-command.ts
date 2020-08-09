import * as fs from 'fs-extra';
import { Command } from 'clipanion';

import { Compiler, JsiiCompiler, TscCompiler } from '../compiler';
import { BaseProjectCommand } from '../base-command';

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
    });

    this.context.done(`Contruct ${this.projectInfo.name} created.`);

    return 0;
  }

  private getCompiler(): Compiler {
    if (this.projectInfo.jsii) {
      return new JsiiCompiler();
    }
    return new TscCompiler();
  }
}
