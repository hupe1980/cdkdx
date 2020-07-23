import * as path from 'path';
import * as fs from 'fs-extra';
import { renderSinglePageModule } from 'jsii-docgen';
import { Docgen, DocgenProps } from './docgen';

export class JsiiDocgen implements Docgen {
  public async generate(props: DocgenProps): Promise<void> {
    if (!fs.existsSync(path.join(props.projectPath, '.jsii'))) {
      throw new Error('File .jsii is missing! Please run cdkdx build first.');
    }

    await renderSinglePageModule(props.projectPath, 'API.md');
  }
}
