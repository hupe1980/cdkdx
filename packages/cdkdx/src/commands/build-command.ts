import { Command } from 'clipanion';

import  { ConstructCommand } from './construct-command';
import { Compiler, JsiiCompiler, TscCompiler } from '../compiler';

export class BuildCommand extends ConstructCommand {
  @Command.Path('build')
  async execute(): Promise<number> {
    const bundleExitCode = await this.cli.run(['bundle']);

    if (bundleExitCode !== 0) return bundleExitCode;

    const compiler = this.getCompiler()

    await compiler.compile();

    this.context.stdout.write(`✅ Construct ${this.constructInfo.name} compiled.\n\n`);

    return 0;
  }

  private getCompiler(): Compiler {
    if (this.constructInfo.isJsii) {
      return new JsiiCompiler();
    } 
    return new TscCompiler({
      cwd: this.context.cwd,
    })
  }
}
