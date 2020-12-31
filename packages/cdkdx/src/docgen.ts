import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';
import { renderSinglePageModule } from 'jsii-docgen';
import { Application, TSConfigReader } from 'typedoc';
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
    const app = new Application();
    app.options.addReader(new TSConfigReader());

    app.bootstrap({
      entryPoints: [path.join(options.projectPath, 'src', 'index.ts')],
      //entryPoints: ['src/index.ts'],
      disableSources: true,
      readme: 'none',
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

    const project = app.convert();

    if (project) {
      await app.generateDocs(project, outDir);
      return;
    }

    throw new Error('Docgen execution failed.');
  }
}
