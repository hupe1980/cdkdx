import { builtinModules } from 'module';
import * as path from 'path';
import * as fs from 'fs-extra';
import webpack from 'webpack';
import { PackageJson } from 'type-fest';

import { PackageManager } from '../package-manager';

export interface NodeModulesPluginOptions {
  nodeModules: string[];
}

export class NodeModulesPlugin {
  public static readonly NAME = 'NodeModulesPlugin';

  private readonly packageJsonMap: Record<string, PackageJson>;
  private readonly packageManager: PackageManager;

  constructor(private readonly options: NodeModulesPluginOptions) {
    this.packageJsonMap = {};
    this.packageManager = new PackageManager();
  }

  apply(compiler: webpack.Compiler): void {
    if (this.options.nodeModules.length === 0) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processModule = async (name: string, module: any) => {
      const portableId: string = module.portableId
        ? module.portableId
        : module.identifier();

      if (!portableId.startsWith('external')) return;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const moduleName = /"(.*?)"/.exec(portableId)![1];

      if (builtinModules.includes(moduleName)) return;

      // check external
      if (!this.options.nodeModules.includes(moduleName)) return;

      const context = module.issuer?.context;

      try {
        const modulePackageFile = require.resolve(
          `${moduleName}/package.json`,
          context
            ? {
                paths: [context],
              }
            : undefined,
        );

        const { version } = (await fs.readJSON(
          modulePackageFile,
        )) as PackageJson;

        if (!version) throw new Error('Package.json without version');

        this.packageJsonMap[name] = {
          name,
          private: true,
          dependencies: {
            [moduleName]: version,
          },
        };
      } catch (e) {
        throw new Error(`Error while processing nodeModules: ${e.message}`);
      }
    };

    compiler.hooks.emit.tapPromise(
      NodeModulesPlugin.NAME,
      async (compilation: webpack.compilation.Compilation): Promise<void> => {
        await Promise.all(
          compilation.chunks.map((chunk) =>
            Promise.all(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (chunk.modulesIterable as Array<any>).map((module) =>
                processModule(chunk.name, module),
              ),
            ),
          ),
        );

        Object.keys(this.packageJsonMap).forEach((key) => {
          const json = JSON.stringify(this.packageJsonMap[key]);

          compilation.assets[`${key}/package.json`] = {
            source: function () {
              return json;
            },
            size: function () {
              return json.length;
            },
          };
        });
      },
    );

    compiler.hooks.afterEmit.tapPromise(NodeModulesPlugin.NAME, async () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const outputPath = compiler.options.output!.path as string;

      await Promise.all(
        Object.keys(this.packageJsonMap).map((key) =>
          this.packageManager.install({
            cwd: path.join(outputPath, key),
            noLockfile: true,
          }),
        ),
      );
    });
  }
}
