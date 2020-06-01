import * as path from 'path';
import * as fs from 'fs-extra';
import camelCase from 'camelcase';
import Handlebars from 'handlebars';

export type Compiler = 'tsc' | 'jsii';

export interface TemplateProps {
  cdkdxVersion: string;
  cdkVersion: string;
  name: string;
  author: string;
  compiler: Compiler;
  templatePath: string;
}

export class Template {
  constructor(private props: TemplateProps) {
    Handlebars.registerHelper('camelCase', (str: string) => camelCase(str));
    
    Handlebars.registerHelper('pascalCase', (str: string) =>
      camelCase(str, { pascalCase: true })
    );
    
    Handlebars.registerHelper('underscore', (str: string) => str.replace('-', '_'));
    
    Handlebars.registerHelper('isJsiiCompiler', (options) =>
      props.compiler === 'jsii' ? options.fn(props) : undefined
    );
  }

  public async install(targetPath: string): Promise<void> {
    await this.installFiles(this.props.templatePath, targetPath);
  }

  private async installFiles(source: string, target: string): Promise<void> {
    const files = await fs.readdir(source);

    for(const file of files) {
      const sourceFile = path.join(source, file);
      const targetFile = path.join(target, this.renderTemplate(file));
      
      const stats = await fs.stat(sourceFile);
      
      if (stats.isDirectory()) {
        await fs.mkdir(targetFile);
        await this.installFiles(sourceFile, this.renderTemplate(targetFile));
      } else if (file.match(/^.*\.template\.[^.]+$/)) {
        const template = await fs.readFile(sourceFile, { encoding: 'utf-8' });
        
        await fs.writeFile(
          targetFile.replace(/\.template(\.[^.]+)$/, '$1'),
          this.renderTemplate(template)
        );
      } else {
        await fs.copy(sourceFile, targetFile);
      }
    }
  }

  private renderTemplate(template: string): string {
    return Handlebars.compile(template)({ 
      ...this.props,
    });
  }
}