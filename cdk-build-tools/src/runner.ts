export interface Runner {
  run: (args?: ReadonlyArray<string>) => Promise<void>;
}