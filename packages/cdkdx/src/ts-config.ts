import * as fs from 'fs-extra';
import ts from 'typescript';

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

export interface TsConfigStructure {
  compilerOptions: Record<string, unknown>;
  exclude?: string[];
  include?: string[];
}

export interface TsConfigProps {
  outDir?: string;
  exclude?: string[];
  include?: string[];
}

export class TsConfig {
  private tsConfig: TsConfigStructure;

  constructor(props?: TsConfigProps) {
    this.tsConfig = {
      compilerOptions: {
        ...BASE_COMPILER_OPTIONS,
        module:
          BASE_COMPILER_OPTIONS.module &&
          ts.ModuleKind[BASE_COMPILER_OPTIONS.module],
        target:
          BASE_COMPILER_OPTIONS.target &&
          ts.ScriptTarget[BASE_COMPILER_OPTIONS.target],
        outDir: props?.outDir,
      },
      exclude: props?.exclude,
      include: props?.include,
    }
  }

  public getCompilerOptions(): TsConfigStructure['compilerOptions'] {
    return this.tsConfig.compilerOptions;
  }

  public async writeJson(filePath: string, options: { overwriteExisting?: boolean } = {}): Promise<void> {
    if (!options.overwriteExisting) {
      const exists = await fs.pathExists(filePath);
      if (exists) {
        return;
      }
    }

    await fs.writeJson(filePath, this.tsConfig, {
      encoding: 'utf8',
      spaces: 2,
    });
  }
}