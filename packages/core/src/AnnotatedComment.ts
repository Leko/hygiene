export type AnnotatedComment<Annotation> = {
  annotation: Annotation;

  /**
   * ex. 'TODO', 'FIXME'
   */
  kind: string;

  /**
   * ex. xxx/yyy/zzz.js
   */
  file: string;

  /**
   * A line number of comment in file
   */
  line: number;

  /**
   * The body of annotated comment
   */
  text: string;
};
