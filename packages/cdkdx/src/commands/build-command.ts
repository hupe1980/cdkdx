import { Command } from 'clipanion';

import { Context } from '../context';
import { shell } from '../shell';

export interface CompilerOverrides {
  jsii?: string;
  tsc?: string;
}

export class BuildCommand extends Command<Context> {
  @Command.Path('build')
  async execute(): Promise<number> {
    const bundleExitCode = await this.cli.run(['bundle']);

    if (bundleExitCode !== 0) return bundleExitCode;

    await shell(this.packageCompiler({}));

    this.context.stdout.write(
      `✅ Construct ${this.context.name} compiled.\n\n`
    );

    return 0;
  }

  private packageCompiler(compilers: CompilerOverrides): string[] {
    if (this.context.isJsii) {
      return [
        compilers.jsii || require.resolve('jsii/bin/jsii'),
        '--project-references',
        '--silence-warnings=reserved-word',
      ];
    } else {
      return [
        compilers.tsc || require.resolve('typescript/bin/tsc'),
        '--build',
      ];
    }
  }
}
