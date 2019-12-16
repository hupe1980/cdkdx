import { Runner } from '../runner';
import { execProgram } from '../utils';
import { PackageInfo } from '../package-info';

export class Compiler implements Runner {
  constructor(private readonly packageInfo: PackageInfo) {
  }

  public async run(args?: ReadonlyArray<string>) {
    let command = '';
    const compilerArgs = args ? [...args] : [];

    if (this.packageInfo.isJsii()) {
      command = require.resolve('jsii/bin/jsii');
      compilerArgs.push('--project-references');
    } else {
      command = require.resolve('typescript/bin/tsc');
    }

    await execProgram(command, compilerArgs);
  }
}
