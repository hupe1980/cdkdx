import path from 'path';
import jest from 'jest';

import { PackageInfo } from './package-info';
import { execProgram } from './exec-program';
import { packDirectory } from './pack-directory';
import { createJestConfig } from './create-jest-config';

export class Toolkit {
  constructor(private readonly packageInfo: PackageInfo) {}

  public async compile(watchMode: boolean): Promise<void> {
    const compiler = this.packageInfo.getCompiler({ watchMode });
    await execProgram(compiler.command, compiler.args);
  }

  public async bundleLambdas(): Promise<void> {
    const lambdaDependencies = this.packageInfo.getLambdaDependencies();

    if (lambdaDependencies) {
      await Promise.all(
        Object.keys(lambdaDependencies).map(
          async (lambdaPkg): Promise<void> => {
            const lambdaSrc = path.join(
              this.packageInfo.cwd,
              'node_modules',
              ...lambdaPkg.split('/')
            );
            const lambdaDest = path.join(
              this.packageInfo.cwd,
              'lambda',
              lambdaDependencies[lambdaPkg]
            );

            await packDirectory(lambdaSrc, lambdaDest);
          }
        )
      );
    }
  }

  public async test(): Promise<void> {
    process.env.NODE_ENV = 'test';

    const jestConfig = createJestConfig(this.packageInfo.cwd);

    const args: string[] = [];

    args.push(
      '--config',
      JSON.stringify({
        ...jestConfig
      })
    );

    await jest.run(args);
  }
}
