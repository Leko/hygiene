import { AnnotatedComment } from "./AnnotatedComment";

export interface Resolver<Annotation> {
  isMine(annotation: Annotation): annotation is Annotation;
  isResolved(comment: AnnotatedComment<Annotation>): Promise<boolean>;
}
