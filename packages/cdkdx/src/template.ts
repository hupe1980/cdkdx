import * as path from 'path';
import * as fs from 'fs-extra';
import camelCase from 'camelcase';
import {
  Liquid,
  TagToken,
  TopLevelToken,
  ParseStream,
  Template as LiquidTemplate,
  Context as LiquidContext,
  Emitter,
} from 'liquidjs';

const TEMPLATES_PATH = path.join(__dirname, '..', 'templates');

const IGNORE_FILES = ['.DS_Store'];

export interface TemplateContext {
  cdkdxVersion: string;
  cdkVersion: string;
  name: string;
  type: 'lib' | 'app';
  templateName: string;
  author: string;
  compiler: 'tsc' | 'jsii';
}

export class Template {
  public dependencyNames: string[];

  private templatePath: string;
  private engine: Liquid;

  constructor(private context: TemplateContext) {
    this.templatePath = path.join(
      TEMPLATES_PATH,
      this.context.type,
      this.context.templateName
    );

    this.engine = new Liquid();

    this.engine.registerFilter('camelCase', (str: string) => camelCase(str));

    this.engine.registerFilter('pascalCase', (str: string) =>
      camelCase(str, { pascalCase: true })
    );

    this.engine.registerFilter('underscore', (str: string) =>
      str.replace('-', '_')
    );

    this.engine.registerTag('ifjsii', {
      parse: function (token: TagToken, remainTokens: TopLevelToken[]) {
        this.tpls = [] as LiquidTemplate[];
        const stream: ParseStream = this.liquid.parser
          .parseStream(remainTokens)
          .on('tag:endifjsii', () => stream.stop())
          .on('template', (tpl: LiquidTemplate) => this.tpls.push(tpl))
          .on('end', () => {
            throw new Error(`tag ${token.getText()} not closed`);
          });
        stream.start();
      },
      render: function* (ctx: LiquidContext, emitter: Emitter) {
        if (context.compiler === 'jsii') {
          const r = this.liquid.renderer;
          const jsii = yield r.renderTemplates(this.tpls, ctx);

          emitter.write(jsii);
        }
      },
    });
  }

  public async install(targetPath: string): Promise<void> {
    await this.installFiles(this.templatePath, targetPath);
  }

  private async installFiles(source: string, target: string): Promise<void> {
    await fs.mkdirp(target);

    const files = await fs.readdir(source);

    for (const file of files) {
      if (IGNORE_FILES.includes(file)) {
        continue;
      }
      
      const sourceFile = path.join(source, file);

      const renderedFileName = await this.renderTemplate(file);
      const targetFile = path.join(target, renderedFileName);

      const stats = await fs.stat(sourceFile);

      if (stats.isDirectory()) {
        await fs.mkdirp(targetFile);
        await this.installFiles(sourceFile, targetFile);
        
      } else {
        const template = await fs.readFile(sourceFile, {
          encoding: 'utf-8',
        });
        
        const renderedTemplate = await this.renderTemplate(template);

        if (file === 'package.json') {
          const pkgJson = JSON.parse(renderedTemplate);
          
          this.dependencyNames = [
            ...Object.keys(pkgJson.dependencies),
            ...Object.keys(pkgJson.devDependencies),
          ];
          
          await fs.writeJSON(targetFile, pkgJson, {
            encoding: 'utf8',
            spaces: 2,
          });

        } else {
          await fs.writeFile(targetFile, renderedTemplate, {
            encoding: 'utf8',
          });
        }
      }
    }
  }

  private async renderTemplate(template: string): Promise<string> {
    return this.engine.parseAndRender(template, {
      ...this.context,
    });
  }
}
