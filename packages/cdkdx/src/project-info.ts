import type { PackageJson as TypeFestPackageJson } from 'type-fest';
import * as path from 'path';
import * as fs from 'fs-extra';
import globby from 'globby';

export type PackageJson = TypeFestPackageJson & {
  externals?: string[];
  nodeModules?: string[];
  jsii?: Record<string, unknown>;
};

export class ProjectInfo {
  public readonly name: string;
  public readonly private: boolean;
  public readonly isJsii: boolean;
  public readonly isConstructLib: boolean;
  public readonly externals: string[];
  public readonly nodeModules: string[];
  public readonly peerDependencies: PackageJson['peerDependencies'];
  public readonly dependencies: PackageJson['dependencies'];
  public readonly devDependencies: PackageJson['devDependencies'];

  //ts-config
  public readonly typescriptIncludes: string[];
  public readonly typescriptExcludes: string[];

  //paths
  public readonly cdkdxConfigPath: string;
  public readonly root: string;
  public readonly srcPath: string;
  public readonly distPath: string;
  public readonly libPath: string;
  public readonly lambdasSrcPath: string;
  public readonly lambdasOutPath: string;
  public readonly layersSrcPath: string;
  public readonly layersOutPath: string;

  private pkgJson: PackageJson;

  constructor(private readonly cwd: string) {
    this.pkgJson = fs.readJSONSync(
      path.join(cwd, 'package.json'),
    ) as PackageJson;

    if (!this.pkgJson.name) {
      throw new Error('Property "name" is missing in package.json');
    }

    this.name = this.pkgJson.name;
    this.private = this.pkgJson.private ?? false;
    this.isJsii = this.pkgJson.jsii !== undefined;
    this.isConstructLib = !fs.existsSync(this.resolve('cdk.json'));

    this.externals = this.pkgJson.externals ?? [];
    this.nodeModules = this.pkgJson.nodeModules ?? [];

    this.peerDependencies = this.pkgJson.peerDependencies;
    this.dependencies = this.pkgJson.dependencies;
    this.devDependencies = this.pkgJson.devDependencies;

    this.typescriptIncludes = ['src'];
    this.typescriptExcludes = ['src/lambdas', 'src/**/__tests__'];

    this.cdkdxConfigPath = this.resolve('cdkdx.config.js');
    this.root = this.resolve('.');
    this.srcPath = this.resolve('src');
    this.distPath = this.resolve('dist');
    this.libPath = this.resolve('lib');
    this.lambdasSrcPath = this.resolve('src/lambdas');
    this.lambdasOutPath = this.resolve('lib/lambdas');
    this.layersSrcPath = this.resolve('src/layers');
    this.layersOutPath = this.resolve('lib/layers');
  }

  get workspaces(): string[] | undefined {
    if (!this.pkgJson.workspaces) return;

    return Array.isArray(this.pkgJson.workspaces)
      ? this.pkgJson.workspaces
      : this.pkgJson.workspaces.packages;
  }

  public async getWorkspaceProjectInfos(): Promise<ProjectInfo[] | undefined> {
    if (!this.workspaces) return;
    const infos: ProjectInfo[] = [];

    for (const ws of this.workspaces) {
      const pattern = `${this.cwd}/${ws}`;
      if (pattern.indexOf('*') === -1) {
        infos.push(new ProjectInfo(pattern));
      } else {
        const paths = await globby(pattern, {
          onlyDirectories: true,
        });

        paths.forEach((path) => {
          infos.push(new ProjectInfo(path));
        });
      }
    }

    return infos;
  }

  public async syncPkgJson(): Promise<void> {
    await fs.writeJSON(this.resolve('package.json'), this.pkgJson, {
      spaces: 2,
    });
  }

  public async hasLambdaSrc(): Promise<boolean> {
    return fs.pathExists(this.lambdasSrcPath);
  }

  private resolve(relativePath: string): string {
    return path.resolve(this.cwd, relativePath);
  }
}
