import * as path from 'path';
import * as fs from 'fs-extra';
import execa from 'execa';

import { Compiler, CompilerProps } from './compiler';
import { TsConfigBuilder } from '../ts-config-builder';

export interface TscCompilerProps {
  readonly cwd: string;
}

export class TscCompiler implements Compiler {
  private readonly configPath: string;

  constructor(props: TscCompilerProps) {
    this.configPath = path.join(props.cwd, 'tsconfig.json');
  }

  public async compile(props?: CompilerProps): Promise<void> {
    await this.writeTypeScriptConfig();

    const command = require.resolve('typescript/bin/tsc');
    const args = ['--build'];

    if(props?.watch) {
      args.push('-w');
    }

    await execa(command, args, {
      stdio: ['ignore', 'inherit', 'inherit'],
    });
  }

  private async writeTypeScriptConfig(): Promise<void> {
    const exists = await fs.pathExists(this.configPath);
    if (exists) {
      return;
    }

    const tsConfigBuilder = new TsConfigBuilder();

    tsConfigBuilder.setOutDir('./lib');
    tsConfigBuilder.addIncludes('src');
    tsConfigBuilder.addExcludes('src/lambdas', 'src/**/__tests__');

    await tsConfigBuilder.writeJson(this.configPath);
  }
}
