import path from 'path';
import fs from 'fs-extra';
import findWorkspaceRoot from 'find-workspace-root';

export interface Packager {
  readonly command: string;
  readonly args: ReadonlyArray<string>;
}

export interface LambdaConfig {
  runtime: string;
  handler: string;
  artifact: string;
}

export type LambdaDependencies = Record<string, LambdaConfig>;

export interface PackageJson {
  readonly name: string;
  readonly version?: string;
  readonly private?: boolean;
  readonly description?: string;
  readonly keywords?: string[];
  readonly homepage?: string;
  readonly license?: string;
  readonly files?: string[];
  readonly main?: string;
  readonly bin?: string | Record<string, string>;
  readonly scripts?: Record<string, string>;
  readonly dependencies?: Record<string, string>;
  readonly devDependencies?: Record<string, string>;
  readonly peerDependencies?: Record<string, string>;
  readonly optionalDependencies?: Record<string, string>;
  readonly bundledDependencies?: string[];

  // custom
  readonly eslint?: any;
  readonly workspaces?: any;
  readonly jsii?: any;
  readonly lambdaDependencies?: LambdaDependencies;
}

export class PackageInfo {
  constructor(
    public readonly cwd: string,
    public readonly rootDir: string | null,
    private readonly pkgJson: PackageJson
  ) {}

  public get name(): string {
    return this.pkgJson.name;
  }

  public get version(): string | undefined {
    return this.pkgJson.version;
  }

  public get eslint(): any {
    return this.pkgJson.eslint;
  }

  public isRoot(): boolean {
    return this.cwd === this.rootDir;
  }

  public isJsii(): boolean {
    return this.pkgJson.jsii !== undefined;
  }

  public isPrivate(): boolean {
    return !!this.pkgJson.private;
  }

  public getLambdaDependencies(): LambdaDependencies | undefined {
    return this.pkgJson.lambdaDependencies;
  }

  public static async createInstance(wd?: string): Promise<PackageInfo> {
    const cwd = wd || process.cwd();

    const rootDir = await findWorkspaceRoot(cwd);

    const pkgJson = await fs.readJSON(path.join(cwd, 'package.json'));

    return new PackageInfo(cwd, rootDir, pkgJson);
  }
}
