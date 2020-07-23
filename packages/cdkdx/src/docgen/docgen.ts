export interface DocgenProps {
  projectPath: string;
}

export interface Docgen {
  generate: (props: DocgenProps) => Promise<void>;
}
