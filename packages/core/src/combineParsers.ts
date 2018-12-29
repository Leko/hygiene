import { Plugin } from "./Plugin";

export function combineParsers(
  ...plugins: Plugin<any, any>[]
): Plugin<any, any>["parse"] {
  return async function parse(body: string, config: any) {
    for (let plugin of plugins) {
      const parsed = plugin.parse(body, config);
      if (parsed) {
        return parsed;
      }
    }
    return null;
  };
}
