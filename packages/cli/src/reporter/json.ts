import { Reporter, ReportMessage } from "./Reporter";

export const stringify = (comment: ReportMessage): string =>
  JSON.stringify(comment);

export const json: Reporter = async comments => {
  comments.map(stringify).forEach(msg => console.log(msg));
};
