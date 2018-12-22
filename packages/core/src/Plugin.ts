import { AnnotatedComment } from "./AnnotatedComment";

export interface ConfigDefinition {
  [name: string]: {
    describe: string;
    type: string; // FIXME: enum
    default: any; // FIXME
  };
}

export interface Plugin<Config, Annotation> {
  name: string;

  toMessage(annotation: Annotation, option: Option): string;

  isMine(annotation: Annotation, config: Config): annotation is Annotation;

  isResolved(
    comment: AnnotatedComment<Annotation>,
    config: Config
  ): Promise<boolean>;

  /**
   * null means parse failure
   */
  parse(body: string, config: Config): Promise<Annotation | null>;

  getConfigDefinition(): ConfigDefinition;
}
