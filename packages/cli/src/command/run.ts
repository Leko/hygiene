import { readFile, exists } from "fs";
import { promisify } from "util";
import { relative } from "path";
import ignore from "ignore";
import pick from "lodash/pick";
import flow from "lodash/flow";
import { parseFiles, filterExpired, Plugin, BodyParser } from "@hygiene/core";
import * as reporters from "../reporter";

export interface Options {
  json: boolean;
  glob: string;
  ignorePattern?: string;
  ignorePath: string;
  ignore: boolean;
}

const readFileAsync = promisify(readFile);
const existsAsync = promisify(exists);

export const createFilter = async ({
  ignorePattern,
  ignorePath,
  cwd
}: {
  ignorePattern?: string;
  ignorePath: string;
  cwd: string;
}) => {
  const blacklist = ignore();
  if (ignorePath) {
    if (await existsAsync(ignorePath)) {
      // TODO: Verbose logging
      blacklist.add(await readFileAsync(ignorePath, "utf8"));
    } else {
      // TODO: Verbose logging
    }
  }
  if (ignorePattern) {
    // TODO: Verbose logging
    blacklist.add(ignorePattern);
  }

  // https://www.npmjs.com/package/ignore#1-pathname-should-be-a-pathrelative-d-pathname
  return flow(
    (path: string) => relative(cwd, path),
    (path: string) => {
      try {
        return !blacklist.ignores(path);
      } catch (e) {
        if (e.message.includes("relative")) {
          return true;
        }

        throw e;
      }
    }
  );
};

export const run = <T>({
  bodyParser,
  plugins
}: {
  bodyParser: BodyParser<T>;
  plugins: Plugin<any, any>[];
}) => async (argv: Options) => {
  const { glob, json, ignore, ignorePattern, ignorePath } = argv;

  const report = json ? reporters.json : reporters.text;
  const filter = ignore
    ? await createFilter({
        ignorePattern,
        ignorePath,
        cwd: process.cwd()
      })
    : () => true;
  const pluginConfigs = plugins.map(plugin =>
    pick(argv, Object.keys(plugin.getConfigDefinition()))
  );

  const comments = await parseFiles(glob, bodyParser, {
    filter
  });
  const expiredComments = await filterExpired(comments, plugins, pluginConfigs);
  return report(expiredComments, plugins, pluginConfigs);
};
