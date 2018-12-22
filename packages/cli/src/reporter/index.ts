import { AnnotatedComment, Plugin } from "@hygiene/core";
import { Reporter, ReportWrapper } from "./Reporter";
import { text as textReporter } from "./text";
import { json as jsonReporter } from "./json";

const wrapReporter = (r: Reporter): ReportWrapper => (
  comments: AnnotatedComment<never>[],
  plugins: Plugin<any>[],
  pluginSettings: any[]
) => {
  return r(
    comments.map(comment => {
      const { annotation, ...other } = comment;
      const plugin = plugins.find(plugin => plugin.isMine(annotation));
      const pluginSetting = pluginSettings[plugins.indexOf(plugin)];
      const message = plugin.toMessage(annotation, pluginSetting);

      return {
        ruleName: plugin.name,
        message,
        ...other
      };
    })
  );
};

export const text = wrapReporter(textReporter);
export const json = wrapReporter(jsonReporter);
