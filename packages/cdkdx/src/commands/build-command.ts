import { Command } from 'clipanion';

import  { ConstructCommand } from './construct-command';
import { Compiler, JsiiCompiler, TscCompiler } from '../compiler';

export class BuildCommand extends ConstructCommand {
  @Command.Boolean('--watch')
  @Command.Boolean('-w')
  public watch = false;

  @Command.Path('build')
  async execute(): Promise<number> {
    const bundleCommand = ['bundle'];

    if(this.watch) {
      bundleCommand.push('-w');
    }

    const bundleExitCode = await this.cli.run(bundleCommand);

    if (bundleExitCode !== 0) return bundleExitCode;

    const compiler = this.getCompiler();

    await compiler.compile({
      watch: this.watch,
    });

    this.context.stdout.write(
      `✅ Construct ${this.constructInfo.name} compiled.\n\n`
    );

    return 0;
  }

  private getCompiler(): Compiler {
    if (this.constructInfo.isJsii) {
      return new JsiiCompiler();
    }
    return new TscCompiler({
      cwd: this.context.cwd,
    });
  }
}
