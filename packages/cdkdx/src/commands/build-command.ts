import { Command } from 'clipanion';
import execa from 'execa';

import  { ConstructCommand } from './construct-command';

export interface CompilerOverrides {
  jsii?: string;
  tsc?: string;
}

export class BuildCommand extends ConstructCommand {
  @Command.Path('build')
  async execute(): Promise<number> {
    const bundleExitCode = await this.cli.run(['bundle']);

    if (bundleExitCode !== 0) return bundleExitCode;

    const { command, args } = this.packageCompiler({});

    await execa(command, args);

    this.context.stdout.write(`✅ Construct ${this.constructInfo.name} compiled.\n\n`);

    return 0;
  }

  private packageCompiler(
    compilers: CompilerOverrides
  ): { command: string; args: string[] } {
    if (this.constructInfo.isJsii) {
      return {
        command: compilers.jsii || require.resolve('jsii/bin/jsii'),
        args: ['--project-references', '--silence-warnings=reserved-word'],
      };
    } else {
      return {
        command: compilers.tsc || require.resolve('typescript/bin/tsc'),
        args: ['--build'],
      };
    }
  }
}
