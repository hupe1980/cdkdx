import * as path from 'path';
import execa from 'execa';

import { Compiler, CompilerProps } from './compiler';
import { TsConfig } from '../ts-config';

export class TscCompiler implements Compiler {
  public async compile(props: CompilerProps): Promise<void> {
    const tsConfig = TsConfig.fromJsiiTemplate({
      outDir: './lib',
      include: ['src'],
      exclude: ['src/lambdas', 'src/**/__tests__'],
    });

    await tsConfig.writeJson(path.join(props.cwd, 'tsconfig.json'), {
      overwriteExisting: false,
    });

    const command = require.resolve('typescript/bin/tsc');
    const args = ['--build'];

    if (props?.watch) {
      args.push('-w');
    }

    await execa(command, args, {
      stdio: ['ignore', 'inherit', 'inherit'],
    });
  }
}
