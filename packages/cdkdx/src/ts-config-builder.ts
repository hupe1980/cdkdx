import * as fs from 'fs-extra';
import ts from 'typescript';

export interface TsConfig {
  compilerOptions: Record<string, unknown>;
  exclude?: string[];
  include?: string[];
}

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

export class TsConfigBuilder {
  private tsConfig: TsConfig;

  constructor() {
    this.tsConfig = {
      compilerOptions: {
        ...BASE_COMPILER_OPTIONS,
        module:
          BASE_COMPILER_OPTIONS.module &&
          ts.ModuleKind[BASE_COMPILER_OPTIONS.module],
        target:
          BASE_COMPILER_OPTIONS.target &&
          ts.ScriptTarget[BASE_COMPILER_OPTIONS.target],
      },
    }
  }

  public addIncludes(...includes: string[]): void {
    this.tsConfig.include = includes;
  }

  public addExcludes(...excludes: string[]): void {
    this.tsConfig.exclude = excludes;
  }

  public setOutDir(outDir: string): void {
    this.tsConfig.compilerOptions.outDir = outDir;
  }

  public async writeJson(filePath: string): Promise<void> {
    await fs.writeJson(filePath, this.tsConfig, {
      encoding: 'utf8',
      spaces: 2,
    });
  }
}