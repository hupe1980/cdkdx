const VALIDATE_SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
const ALLOWED_MODES = ['~', '^'];

export class Semver {
  /**
   * Accept only an exact version
   */
  public static pinned(version: string): Semver {
    return new Semver(version);
  }

  /**
   * Accept any minor version.
   *
   * >= version
   * < next major version
   */
  public static caret(version: string): Semver {
    return new Semver(version, '^');
  }

  /**
   * Accept patches.
   *
   * >= version
   * < next minor version
   */
  public static tilde(version: string): Semver {
    return new Semver(version, '~');
  }

  public readonly spec: string;
  public readonly version: string;
  public readonly mode?: string;

  private constructor(version: string, mode?: string) {
    if (!VALIDATE_SEMVER.test(version)) {
      throw new Error(`Invalid semver: ${version}`);
    }

    if (mode && !ALLOWED_MODES.includes(mode)) {
      throw new Error(
        `Mode "${mode}" not allowed. Allowed modes: ${ALLOWED_MODES.join(',')}`,
      );
    }

    this.version = version;
    this.mode = mode;
    this.spec = `${mode ?? ''}${version}`;
  }
}
