import * as leasot from "leasot";
import { AnnotatedComment } from "./AnnotatedComment";
import { BodyParser } from "./BodyParser";

export function parseText<T>(
  content: string,
  filename: string,
  extension: string,
  bodyParser: BodyParser<T>
): Promise<AnnotatedComment<T>[]> {
  if (!leasot.isExtensionSupported(extension)) {
    return Promise.resolve([]);
  }

  const promises = leasot
    .parse(content, {
      extension,
      filename,
      withInlineFiles: true
    })
    .map(
      async (todoComment): Promise<AnnotatedComment<T>> => ({
        kind: todoComment.tag,
        file: todoComment.file,
        line: todoComment.line,
        text: todoComment.text,
        // @ts-ignore Filter annotation is missing immediately
        annotation: await bodyParser(todoComment.text)
      })
    );

  return Promise.all(promises).then(comments =>
    comments.filter(comment => !!comment.annotation)
  );
}
