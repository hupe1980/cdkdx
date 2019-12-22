import fs from 'fs-extra';
import path from 'path';
import archiver from 'archiver';

export interface WebpackZipPluginOptions {
  path?: string;
  filename?: string;
}

export class WebpackZipPlugin {
  constructor(private readonly options?: WebpackZipPluginOptions) {}

  public apply(compiler: any) {
    compiler.hooks.emit.tapPromise(
      WebpackZipPlugin.name,
      (compilation: any) => {
        return new Promise(async (resolve, reject) => {
          const outputPath =
            this.options?.path || compilation.options.output.path;

          const outputFilename =
            this.options?.filename || compilation.options.output.filename;

          const outputFile = path.join(outputPath, outputFilename);

          if (!(await fs.pathExists(outputFile))) {
            await fs.createFile(outputFile);
          }

          const archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
          });

          const { assets } = compilation;

          Object.keys(assets).forEach(file => {
            const asset = assets[file];
            const content = asset.source();

            archive.append(content, {
              name: file
            });
          });

          const ws = fs.createWriteStream(outputFile);

          ws.on('error', e => {
            console.error(e);
          });

          archive.pipe(ws);
          archive.finalize();

          archive.on('warning', reject);
          archive.on('error', reject);

          ws.once('close', (): void => resolve());
        });
      }
    );
  }
}
