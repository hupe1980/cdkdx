import { Command } from 'clipanion';

import  { ProjectCommand } from './project-command';
import { Compiler, JsiiCompiler, TscCompiler } from '../compiler';

export class BuildCommand extends ProjectCommand {
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

    const bundleExitCode = await this.cli.run(bundleCommand);

    if (bundleExitCode !== 0) return bundleExitCode;

    const compiler = this.getCompiler();

    await compiler.compile({
      watch: this.watch,
    });

    this.context.stdout.write(
      `✅ Construct ${this.projectInfo.name} compiled.\n\n`
    );

    return 0;
  }

  private getCompiler(): Compiler {
    if (this.projectInfo.isJsii) {
      return new JsiiCompiler();
    }
    return new TscCompiler({
      cwd: this.context.cwd,
    });
  }
}
