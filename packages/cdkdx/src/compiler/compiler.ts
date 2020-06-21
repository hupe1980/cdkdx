export interface CompilerProps {
  watch?: boolean;
}

export interface Compiler {
  compile: (props?: CompilerProps) => Promise<void>
}
