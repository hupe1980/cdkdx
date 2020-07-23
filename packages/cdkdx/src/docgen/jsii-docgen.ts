import * as path from 'path';
import * as fs from 'fs-extra';
import { renderSinglePageModule } from 'jsii-docgen';
import { Docgen, GenerateOptions } from './docgen';

export class JsiiDocgen implements Docgen {
  public async generate(options: GenerateOptions): Promise<void> {
    if (!fs.existsSync(path.join(options.projectPath, '.jsii'))) {
      throw new Error('File .jsii is missing! Please run cdkdx build first.');
    }

    await renderSinglePageModule(options.projectPath, 'API.md');
  }
}
