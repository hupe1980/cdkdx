import chalk from 'chalk';
import { Command } from 'clipanion';

import { BaseCommand } from '../base-command';
import { Template } from '../template';
import { Timer } from '../timer';

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
    const timer = new Timer();

    const template = await Template.newInstance({
      cwd: this.context.cwd,
      version: this.context.version,
      type: this.type,
      name: this.name,
    });

    template.createProject();

    this.context.logger.info(
      `Installing dependencies:\n${template
        .getDependencyNames()
        .map((dep) => chalk.bold.cyan(dep))
        .join('\n')}\n`,
    );

    await template.installDependencies();

    this.context.logger.done(`Dependencies installed.\n`);

    timer.end();

    this.context.logger.done(`Project created in ${timer.display()}.\n`);

    this.context.logger.info(`${chalk.green(
      'Awesome!',
    )} You are now ready to start coding. 

All you have to do is change the directory:
    ${chalk.bold.cyan(`cd ${this.name}`)}
  
Happy hacking!
    `);

    return 0;
  }
}
