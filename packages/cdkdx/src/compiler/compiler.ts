export interface CompilerProps {
  cwd: string;
  watch?: boolean;
}

export interface Compiler {
  compile: (props: CompilerProps) => Promise<void>
}
