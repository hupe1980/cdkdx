import webpack from 'webpack';

const NAME = 'LambdaFileSizePlugin';

export class LambdaFileSizePlugin {
  constructor() {
    console.log('Plugin');
  }

  apply(compiler: webpack.Compiler): void {
    const hook = (
      compilation: webpack.compilation.Compilation,
    ): Promise<void> => {
      return new Promise((resolve, _reject) => {
        compilation.chunks.forEach((chunk) => {
          console.log(chunk);
        });
        resolve();
      });
    };

    compiler.hooks.emit.tapPromise(NAME, hook);
  }
}
