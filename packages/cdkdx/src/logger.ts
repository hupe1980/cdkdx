import chalk from 'chalk';

export interface LoggerProps {
  stdout: NodeJS.WriteStream;
  stderr: NodeJS.WriteStream;
}

export class Logger {
  constructor(private readonly props: LoggerProps) {}

  public done(message: string): void {
    this.props.stdout.write(
      `${chalk.bgGreen.black(' DONE ')} ${chalk.green(message)}\n`,
    );
  }

  public warn(message: string): void {
    this.props.stdout.write(
      `${chalk.bgYellow.black(' WARN ')} ${chalk.yellow(message)}\n`,
    );
  }

  public log(message: string): void {
    this.props.stdout.write(`${message}\n`);
  }
}
