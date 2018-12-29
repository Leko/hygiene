import { readFile } from "fs";
import path from "path";
import { promisify } from "util";
import { AnnotatedComment } from "./AnnotatedComment";
import { Plugin } from "./Plugin";
import { parseText } from "./parseText";

const readFileAsync = promisify(readFile);

export async function parseFile<T>(
  file: string,
  bodyParser: Plugin<any, any>["parse"]
): Promise<AnnotatedComment<T>[]> {
  return parseText<T>(
    await readFileAsync(file, "utf8"),
    file,
    path.extname(file),
    bodyParser
  );
}
