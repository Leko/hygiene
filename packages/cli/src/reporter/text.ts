import groupBy from "lodash/groupBy";
import { Reporter, ReportMessage } from "./Reporter";

export const stringify = ({ line, message, ruleName }: ReportMessage): string =>
  `  ${line}: ${message} (${ruleName})`;

export const text: Reporter = async comments => {
  Object.entries(groupBy(comments, ({ file }) => file)).forEach(
    ([file, fileComments]) => {
      console.log("\n" + file);
      fileComments.map(stringify).forEach(text => console.log(text));
    }
  );
  console.log(`\n${comments.length} errors found`);
};
