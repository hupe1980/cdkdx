export class Timer {
  public timeMs?: number;
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  public start(): void {
    this.startTime = Date.now();
  }

  public end(): void {
    this.timeMs = (Date.now() - this.startTime) / 1000;
  }

  public display(): string {
    return this.timeMs ? `${this.timeMs}ms` : '???';
  }
}
