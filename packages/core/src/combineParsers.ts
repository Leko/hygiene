import { BodyParser } from "./BodyParser";

export function combineParsers<Annotation>(
  ...parsers: BodyParser<any>[]
): BodyParser<Annotation> {
  return async function parse(body: string) {
    for (let parser of parsers) {
      const parsed = parser(body);
      if (parsed) {
        return parsed;
      }
    }
    return null;
  };
}
