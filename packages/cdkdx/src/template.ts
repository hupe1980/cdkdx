import * as path from 'path';
import * as fs from 'fs-extra';
import camelCase from 'camelcase';
import { Liquid, TagToken, TopLevelToken, ParseStream, Template as LiquidTemplate, Context as LiquidContext, Emitter } from 'liquidjs';

const TEMPLATES_PATH = path.join(__dirname, '..', 'templates');

export interface TemplateContext {
  cdkdxVersion: string;
  cdkVersion: string;
  name: string;
  author: string;
  compiler: 'tsc' | 'jsii';
}

export class Template {
  private templatePath: string;
  private engine: Liquid;

  constructor(name: string, private context: TemplateContext) {
    this.templatePath = path.join(TEMPLATES_PATH, name);
    
    this.engine = new Liquid();

    this.engine.registerFilter('camelCase', (str: string) => camelCase(str));

    this.engine.registerFilter('pascalCase', (str: string) =>
      camelCase(str, { pascalCase: true })
    );

    this.engine.registerFilter('underscore', (str: string) =>
      str.replace('-', '_')
    );

    this.engine.registerTag('jsii', {
      parse: function (token: TagToken, remainTokens: TopLevelToken[]) {
        this.tpls = [] as LiquidTemplate[]
        const stream: ParseStream = this.liquid.parser.parseStream(remainTokens)
          .on('tag:endjsii', () => stream.stop())
          .on('template', (tpl: LiquidTemplate) => this.tpls.push(tpl))
          .on('end', () => {
            throw new Error(`tag ${token.getText()} not closed`)
          })
        stream.start()
      },
      render: function * (ctx:  LiquidContext, emitter: Emitter) {
        if(context.compiler === 'jsii') {
          const r = this.liquid.renderer
          const jsii = yield r.renderTemplates(this.tpls, ctx)

          emitter.write(jsii)
          return;
        }
        emitter.write('');
      },
    });
  }

  public async install(targetPath: string): Promise<void> {
    await this.installFiles(this.templatePath, targetPath);
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
    return this.engine.parseAndRenderSync(template, {
      ...this.context,
    });
  }
}