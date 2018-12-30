import { Plugin } from "./Plugin";

export function combineParsers(
  ...plugins: Pick<Plugin<any, any>, "parse">[]
): Plugin<any, any>["parse"] {
  return async function parse(body: string, config: any) {
    for (let plugin of plugins) {
      const parsed = await plugin.parse(body, config);
      if (parsed) {
        return parsed;
      }
    }
    return null;
  };
}
