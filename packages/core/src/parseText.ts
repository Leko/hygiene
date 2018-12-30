import * as leasot from "leasot";
import _debug from "debug";
import { codeFrameColumns } from "@babel/code-frame";
import { AnnotatedComment } from "./AnnotatedComment";
import { Plugin } from "./Plugin";

const debug = _debug("hygiene/core");

export function parseText<T>(
  content: string,
  filename: string,
  extension: string,
  bodyParser: Plugin<any, any>["parse"]
): Promise<AnnotatedComment<T>[]> {
  if (!leasot.isExtensionSupported(extension)) {
    debug(`${extension} is not supported yet`);
    return Promise.resolve([]);
  }

  const promises = leasot
    .parse(content, {
      extension,
      filename,
      // FIXME: https://github.com/pgilad/leasot/pull/109
      withInlineFiles: false
    })
    .map(
      async (todoComment): Promise<AnnotatedComment<T>> => ({
        kind: todoComment.tag,
        file: todoComment.file,
        line: todoComment.line,
        text: todoComment.text,
        codeFrame: codeFrameColumns(content, {
          start: { line: todoComment.line }
        }),
        // @ts-ignore Filter annotation is missing immediately
        annotation: await bodyParser(todoComment.text)
      })
    );

  return Promise.all(promises).then(comments =>
    comments.filter(comment => !!comment.annotation)
  );
}
