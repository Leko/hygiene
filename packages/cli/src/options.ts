import mapValues from "lodash/mapValues";
import yargs from "yargs";
import { sync as findUp } from "find-up";
import { Plugin } from "@hygiene/core";
import { run } from "./command/run";

export const createCommand = ({ plugins }: { plugins: Plugin<any, any>[] }) => {
  const cmd = yargs
    .scriptName("hygiene")
    .option("json", {
      group: "Global Options",
      describe: "Report as JSON",
      type: "boolean",
      default: false
    })
    .option("ignore-pattern", {
      group: "Global Options",
      describe: "Pattern of files to ignore",
      type: "string",
      default: null
    })
    .option("ignore-path", {
      group: "Global Options",
      describe: "Specify path of ignore file",
      type: "string",
      default: findUp(".gitignore")
    })
    .option("ignore", {
      group: "Global Options",
      describe: "Disable use of ignore files and patterns",
      type: "boolean",
      default: true
    })
    .command({
      command: "run [glob]",
      describe: "",
      // @ts-ignore Type 'Argv<{}>' is missing the following properties from type 'Options': _, json, ignorePath
      handler: run({ plugins }),
      builder: yargs =>
        yargs
          .positional("glob", {
            describe: "Pattern of target files",
            default: "**/*"
          })
          .example("$0 run --no-ignore", "Disable ignore feature")
          .example(
            "$0 run --repository Leko/hygiene",
            "Parse non-prefixed issue(ex. #123) as Leko/hygiene"
          )
          .example(
            "GITHUB_TOKEN=xxx $0 run --no-ignore",
            "Set GitHub access token to fetch issue or pull request"
          )
    })
    .demandCommand()
    .epilogue(
      "For more information, find our manual at https://github.com/Leko/hygiene"
    )
    .help();

  plugins.forEach(plugin => {
    const options = mapValues(plugin.getConfigDefinition(), option => ({
      group: `Plugin Options: ${plugin.name}`,
      ...option
    }));
    cmd.options(options);
  });

  return cmd;
};
