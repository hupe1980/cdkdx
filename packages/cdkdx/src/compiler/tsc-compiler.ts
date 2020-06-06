import * as path from 'path';
import * as fs from 'fs-extra';
import execa from 'execa';
import ts from 'typescript';

import { Compiler } from './compiler';

const BASE_COMPILER_OPTIONS: ts.CompilerOptions = {
  alwaysStrict: true,
  charset: 'utf8',
  declaration: true,
  experimentalDecorators: true,
  inlineSourceMap: true,
  inlineSources: true,
  lib: ['es2018'],
  module: ts.ModuleKind.CommonJS,
  noEmitOnError: true,
  noFallthroughCasesInSwitch: true,
  noImplicitAny: true,
  noImplicitReturns: true,
  noImplicitThis: true,
  noUnusedLocals: true,
  noUnusedParameters: true,
  resolveJsonModule: true,
  strict: true,
  strictNullChecks: true,
  strictPropertyInitialization: true,
  stripInternal: true,
  target: ts.ScriptTarget.ES2018,
};

export interface TscCompilerProps {
  readonly cwd: string;
}

export class TscCompiler implements Compiler {
  private readonly configPath: string;

  constructor(props: TscCompilerProps) {
    this.configPath = path.join(props.cwd, 'tsconfig.json');
  }

  public async compile(): Promise<void> {
    this.writeTypeScriptConfig();

    const command = require.resolve('typescript/bin/tsc');
    const args = ['--build'];

    await execa(command, args);
  }

  private async writeTypeScriptConfig(): Promise<void> {
    const exists = await fs.pathExists(this.configPath);
    if (exists) {
      return;
    }

    const outputConfig = {
      compilerOptions: {
        ...BASE_COMPILER_OPTIONS,
        module:
          BASE_COMPILER_OPTIONS.module &&
          ts.ModuleKind[BASE_COMPILER_OPTIONS.module],
        target:
          BASE_COMPILER_OPTIONS.target &&
          ts.ScriptTarget[BASE_COMPILER_OPTIONS.target],
        outDir: './lib',
      },
      include: ['src'],
      exclude: ['src/lambdas', 'src/**/__tests__'],
    };

    await fs.writeJson(this.configPath, outputConfig, {
      encoding: 'utf8',
      spaces: 2,
    });
  }
}
