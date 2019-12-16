import { Runner } from './runner';
import { PackageInfo } from './package-info';

import { TestRunner } from './test-runnrer';
import { Linter } from './linter';
import { Packager } from './packager';
import { Compiler } from './compiler';
//import { Bundler } from './bundler';
export class Toolkit {
  constructor(private readonly packageInfo: PackageInfo) {}

  public async excuteRunner(command: string, args?: ReadonlyArray<string>) {
    const runner = this.createRunner(command);
    await runner.run(args);
  }

  private createRunner(command: string): Runner {
    switch (command) {
      case 'build':
      case 'watch': {
        return new Compiler(this.packageInfo);
      }
      case 'test': {
        return new TestRunner(this.packageInfo);
      }
      case 'lint': {
        return new Linter(this.packageInfo);
      }
      case 'package': {
        return new Packager(this.packageInfo);
      }
      default: {
        throw new Error(`Unknown command: ${command}`);
      }
    }
  }
}
