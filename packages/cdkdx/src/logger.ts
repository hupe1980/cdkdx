import chalk from 'chalk';

export interface LoggerProps {
  stdout: NodeJS.WriteStream;
  stderr: NodeJS.WriteStream;
}

export class Logger {
  constructor(private readonly props: LoggerProps) {
    this.done = this.done.bind(this);
    this.log = this.log.bind(this);
  }

  public done(message: string): void {
    this.props.stdout.write(
      `${chalk.bgGreen.black(' DONE ')} ${chalk.green(message)}\n`,
    );
  }

  public log(message: string): void {
    this.props.stdout.write(`${message}\n`);
  }
}
