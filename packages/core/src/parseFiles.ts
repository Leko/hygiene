import { promisify } from "util";
import glob from "glob";
import flatten from "lodash/flatten";
import { AnnotatedComment } from "./AnnotatedComment";
import { Plugin } from "./Plugin";
import { parseFile } from "./parseFile";

const globAsync = promisify(glob);

export async function parseFiles<T>(
  pattern: string,
  bodyParser: Plugin<any, any>["parse"],
  { filter }: { filter: (path: string) => boolean } = { filter: () => true }
): Promise<AnnotatedComment<T>[]> {
  return globAsync(pattern, { nodir: true })
    .then(paths =>
      Promise.all(
        paths.filter(filter).map(path => parseFile<T>(path, bodyParser))
      )
    )
    .then(flatten);
}
