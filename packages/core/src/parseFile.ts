import { readFile } from "fs";
import path from "path";
import { promisify } from "util";
import { AnnotatedComment } from "./AnnotatedComment";
import { BodyParser } from "./BodyParser";
import { parseText } from "./parseText";

const readFileAsync = promisify(readFile);

export async function parseFile<T>(
  file: string,
  bodyParser: BodyParser<T>
): Promise<AnnotatedComment<T>[]> {
  return parseText<T>(
    await readFileAsync(file, "utf8"),
    file,
    path.extname(file),
    bodyParser
  );
}
