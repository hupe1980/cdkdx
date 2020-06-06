import execa from 'execa';

import { Compiler } from './compiler';

export class JsiiCompiler implements Compiler {
  public async compile(): Promise<void> {
    const command = require.resolve('jsii/bin/jsii');
    const args = ['--project-references', '--silence-warnings=reserved-word'];

    await execa(command, args);
  }
}
