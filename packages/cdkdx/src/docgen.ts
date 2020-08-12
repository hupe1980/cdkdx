import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';
import { renderSinglePageModule } from 'jsii-docgen';
import { Application } from 'typedoc';
import { ScriptTarget, ModuleKind } from 'typescript';
import concatMd from 'concat-md';

import { Logger } from './logger';

export interface GenerateOptions {
  projectPath: string;
  typescriptExcludes?: string[];
  logger: Logger;
}

export interface Docgen {
  generate: (options: GenerateOptions) => Promise<void>;
}

export class JsiiDocgen implements Docgen {
  public async generate(options: GenerateOptions): Promise<void> {
    if (!fs.existsSync(path.join(options.projectPath, '.jsii'))) {
      throw new Error('File .jsii is missing! Please run cdkdx build first.');
    }

    await renderSinglePageModule(options.projectPath, 'API.md');
  }
}

export class TscDocgen implements Docgen {
  public async generate(options: GenerateOptions): Promise<void> {
    const realTempDir = await fs.realpath(os.tmpdir());

    const tempOutDir = await fs.mkdtemp(path.join(realTempDir, 'cdkdx-'));

    await this.runTypedoc(tempOutDir, options);

    const api = await concatMd(tempOutDir, {
      fileNameAsTitle: true,
    });

    await fs.writeFile('API.md', api, {
      encoding: 'utf8',
    });
  }

  private async runTypedoc(
    outDir: string,
    options: GenerateOptions,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const app = new Application();

      app.bootstrap({
        module: ModuleKind.CommonJS,
        target: ScriptTarget.ES2018,
        entryPoint: 'index',
        disableSources: true,
        excludeNotExported: true,
        readme: 'none',
        mode: 'file',
        theme: 'markdown',
        plugin: ['typedoc-plugin-markdown'],
        exclude: options.typescriptExcludes,
        logger: (message: string, level: number) => {
          if (level === 3) {
            //log only errors
            options.logger.fail(`${message}\n`);
          }
        },
      });

      if (
        app.generateDocs(
          app.expandInputFiles([path.join(options.projectPath, 'src')]),
          outDir,
        )
      ) {
        return resolve();
      }

      return reject(new Error('Docgen execution failed.'));
    });
  }
}
