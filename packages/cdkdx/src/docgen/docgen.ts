export interface GenerateOptions {
  projectPath: string;
  typescriptExcludes?: string[];
}

export interface Docgen {
  generate: (options: GenerateOptions) => Promise<void>;
}
