import * as fs from 'fs-extra';
import { Configuration } from 'webpack';
import { ProjectInfo } from './project-info';
import { TsConfigProps } from './ts-config';

export interface ConfigFile {
  webpack: (config: Configuration, projectInfo: ProjectInfo) => Configuration;
  lambdaTsConfig: (
    config: TsConfigProps,
    projectInfo: ProjectInfo,
  ) => TsConfigProps;
}

export class CdkdxConfig {
  private readonly configFile?: ConfigFile;

  constructor(private readonly projectInfo: ProjectInfo) {
    if (fs.existsSync(projectInfo.cdkdxConfigPath)) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      this.configFile = require(projectInfo.cdkdxConfigPath);
    }
  }

  public webpack(config: Configuration): Configuration {
    return this.configFile?.webpack
      ? this.configFile.webpack(config, this.projectInfo)
      : config;
  }

  public lambdaTsConfig(config: TsConfigProps): TsConfigProps {
    return this.configFile?.lambdaTsConfig
      ? this.configFile.lambdaTsConfig(config, this.projectInfo)
      : config;
  }
}
