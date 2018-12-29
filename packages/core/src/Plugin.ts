import { AnnotatedComment } from "./AnnotatedComment";

export type ConfigDefinition<C> = {
  [name in keyof C]: {
    describe: string;
    type: "string" | "number" | "boolean" | "array" | "count" | undefined;
    default: any; // FIXME
    [x: string]: any;
  }
};

export interface Plugin<Config, Annotation> {
  name: string;

  toMessage(annotation: Annotation, config: Config): string;

  isMine(annotation: Annotation, config: Config): annotation is Annotation;

  isResolved(
    comment: AnnotatedComment<Annotation>,
    config: Config
  ): Promise<boolean>;

  /**
   * null means parse failure
   */
  parse(body: string, config: Config): Promise<Annotation | null>;

  getConfigDefinition(): ConfigDefinition<Config>;
}
