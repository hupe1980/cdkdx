import fs from 'fs-extra';
import path from 'path';
import {
  AssetCode,
  CfnParametersCode,
  CfnParametersCodeProps,
  InlineCode,
  S3Code,
  Runtime
} from '@aws-cdk/aws-lambda';
import { AssetOptions } from '@aws-cdk/aws-s3-assets';
import { IBucket } from '@aws-cdk/aws-s3';
import pkgConf from 'pkg-conf';

export interface ManifestProps {
  name: string;
}

export interface LambdaConfig {
  runtime?: string;
  handler?: string;
  artifact: string;
}

export class LambdaCode {
  public static fromManifest(props: ManifestProps) {
    const { name } = props;

    const manifest = pkgConf.sync('lambdaDependencies') as Record<
      string,
      LambdaConfig
    >;

    const filePath = pkgConf.filepath(manifest);

    if (!filePath) {
      throw new Error('TODO');
    }

    const lambdaConfig = manifest[name];

    const lambdaAssetPath = path.join(
      path.dirname(filePath),
      'lambdas',
      lambdaConfig.artifact
    );

    return {
      runtime: lambdaConfig.runtime ? new Runtime(lambdaConfig.runtime) : Runtime.NODEJS_10_X,
      handler: lambdaConfig.handler || 'lib/index.handler',
      code: LambdaCode.fromAsset(lambdaAssetPath)
    };
  }

  /**
   * @returns `LambdaS3Code` associated with the specified S3 object.
   * @param bucket The S3 bucket
   * @param key The object key
   * @param objectVersion Optional S3 object version
   */
  public static fromBucket(
    bucket: IBucket,
    key: string,
    objectVersion?: string
  ): S3Code {
    return new S3Code(bucket, key, objectVersion);
  }
  /**
   * @returns `LambdaInlineCode` with inline code.
   * @param code The actual handler code (limited to 4KiB)
   */
  public static fromInline(code: string): InlineCode {
    return new InlineCode(code);
  }

  /**
   * @returns `LambdaInlineCode` with inline code.
   * @param path The path of the source file (limited to 4KiB)
   */
  public static fromFileAsInline(path: string): InlineCode {
    const code = fs.readFileSync(path, { encoding: 'uft8' });
    return new InlineCode(code);
  }

  /**
   * Loads the function code from a local disk asset.
   * In test mode (process.env.NODE_ENV === 'test'), the asset is replaced by an inline code mock
   * @returns `LambdaAssetCode` or `LambdaInlineCode`.
   * @param path Either a directory with the Lambda code bundle or a .zip file
   */
  public static fromAsset(
    path: string,
    options?: AssetOptions
  ): AssetCode | InlineCode {
    if (process.env.NODE_ENV === 'test') {
      return new InlineCode('__MOCK__');
    }

    return new AssetCode(path, options);
  }

  /**
   * Creates a new Lambda source defined using CloudFormation parameters.
   *
   * @returns a new instance of `CfnParametersCode`
   * @param props optional construction properties of {@link CfnParametersCode}
   */
  public static fromCfnParameters(
    props?: CfnParametersCodeProps
  ): CfnParametersCode {
    return new CfnParametersCode(props);
  }
}
