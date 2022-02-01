import * as fs from 'fs-extra';
import type { TsConfigJson } from 'type-fest';

export interface TsConfigProps {
  compilerOptions?: Partial<TsConfigJson.CompilerOptions>;
  outDir?: string;
  exclude?: string[];
  include?: string[];
}
export class TsConfig {
  public static fromJsiiTemplate(props?: TsConfigProps): TsConfig {
    return new TsConfig({
      compilerOptions: {
        alwaysStrict: true,
        charset: 'utf8',
        declaration: true,
        experimentalDecorators: true,
        inlineSourceMap: true,
        inlineSources: true,
        lib: ['es2018'],
        module: 'CommonJS',
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
        target: 'ES2018',
        outDir: props?.outDir,
        ...props?.compilerOptions,
      },
      exclude: props?.exclude,
      include: props?.include,
    });
  }

  public static fromLambdaTemplate(props?: TsConfigProps): TsConfig {
    return new TsConfig({
      compilerOptions: {
        alwaysStrict: true,
        charset: 'utf8',
        declaration: false,
        experimentalDecorators: true,
        esModuleInterop: true,
        sourceMap: true,
        inlineSources: true,
        lib: ['es2018'],
        module: 'CommonJS',
        noEmit: true,
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
        target: 'ES2018',
        jsx: 'react',
        outDir: props?.outDir,
        ...props?.compilerOptions,
      },
      exclude: props?.exclude,
      include: props?.include,
    });
  }

  constructor(private readonly tsConfig: TsConfigJson) {}

  public getCompilerOptions(): TsConfigJson.CompilerOptions | undefined {
    return this.tsConfig.compilerOptions;
  }

  public async writeJson(
    filePath: string,
    options: { overwriteExisting?: boolean } = {},
  ): Promise<void> {
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
