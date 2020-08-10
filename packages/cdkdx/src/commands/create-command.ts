import chalk from 'chalk';
import { Command } from 'clipanion';

import { BaseCommand } from '../base-command';
import { Template } from '../template';

export class CreateCommand extends BaseCommand {
  static usage = Command.Usage({
    description: 'Create a new, empty CDK project from a template',
    details: `
            This command will create a new, empty CDK project from a template.
        `,
    examples: [
      ['Create a cdk app', 'npx cdkdx create app my-app'],
      ['Create a cdk lib', 'npx cdkdx create lib my-lib'],
      ['Create a jsii cdk lib', 'npx cdkdx create jsii-lib my-lib'],
    ],
  });

  @Command.String({ required: true })
  public type!: 'lib' | 'jsii-lib' | 'app';

  @Command.String({ required: true })
  public name!: string;

  @Command.Path('create')
  async execute(): Promise<number> {
    const template = await Template.newInstance({
      cwd: this.context.cwd,
      version: this.context.version,
      type: this.type,
      name: this.name,
    });

    template.createProject();

    this.context.logger.log(
      `Installing dependencies: ${template.getDependencyNames().join(',')}`,
    );

    await template.installDependencies();

    this.context.logger.done(`Dependencies installed.\n`);

    this.context.logger.log(`
      ${chalk.green('Awesome!')} You can now start coding. 
      
      You just have to change the directory:
          ${chalk.bold.cyan(`cd ${this.name}`)}
        
      Happy hacking!
    `);

    return 0;
  }
}
