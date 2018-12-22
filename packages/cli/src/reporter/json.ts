import { AnnotatedComment } from "@hygiene/core";
import { Reporter } from "./Reporter";

export const stringify = (comment: AnnotatedComment<never>): string =>
  JSON.stringify(comment);

export const json: Reporter = async (comments: AnnotatedComment<never>[]) => {
  comments.map(stringify).forEach(msg => console.log(msg));
};
