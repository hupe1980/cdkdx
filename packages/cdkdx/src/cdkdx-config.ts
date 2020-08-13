import * as fs from 'fs-extra';
import { Configuration } from 'webpack';
import { ProjectInfo } from './project-info';

export interface ConfigFile {
  webpack: (config: Configuration) => Configuration;
}

export class CdkdxConfig {
  private readonly configFile?: ConfigFile;

  constructor(projectInfo: ProjectInfo) {
    if (fs.existsSync(projectInfo.cdkdxConfigPath)) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      this.configFile = require(projectInfo.cdkdxConfigPath);
    }
  }

  public webpack(config: Configuration): Configuration {
    return this.configFile?.webpack ? this.configFile.webpack(config) : config;
  }
}
