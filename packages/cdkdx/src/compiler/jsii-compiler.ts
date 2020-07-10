import execa from 'execa';

import { Compiler, CompilerProps } from './compiler';

export class JsiiCompiler implements Compiler {
  public async compile(props: CompilerProps): Promise<void> {
    const command = require.resolve('jsii/bin/jsii');

    const args = ['--project-references', '--silence-warnings=reserved-word'];

    if (props.watch) {
      args.push('-w');
    }

    await execa(command, args);
  }
}
