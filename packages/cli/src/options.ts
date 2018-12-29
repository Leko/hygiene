import mapValues from "lodash/mapValues";
import yargs from "yargs";
import { sync as findUp } from "find-up";
import { Plugin } from "@hygiene/core";
import { run } from "./command/run";

export const createCommand = ({ plugins }: { plugins: Plugin<any, any>[] }) => {
  const cmd = yargs
    .scriptName("hygiene")
    .option("json", {
      describe: "Report as JSON",
      type: "boolean",
      default: false
    })
    .option("ignore-pattern", {
      describe: "Pattern of files to ignore",
      type: "string",
      default: null
    })
    .option("ignore-path", {
      describe: "Specify path of ignore file",
      type: "string",
      default: findUp(".gitignore")
    })
    .option("ignore", {
      describe: "Disable use of ignore files and patterns",
      type: "boolean",
      default: true
    })
    .command({
      command: "run [glob]",
      describe: "",
      // @ts-ignore Type 'Argv<{}>' is missing the following properties from type 'Options': _, json, ignorePath
      handler: run({ plugins }),
      builder: yargs => yargs.default("glob", "**/*")
    })
    .demandCommand()
    .help();

  plugins.forEach(plugin => {
    const options = mapValues(plugin.getConfigDefinition(), option => ({
      group: plugin.name,
      ...option
    }));
    cmd.options(options);
  });

  return cmd;
};
