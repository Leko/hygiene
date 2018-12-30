import { AnnotatedComment } from "./AnnotatedComment";
import { Plugin } from "./Plugin";

export async function filterExpired<A>(
  comments: AnnotatedComment<A>[],
  plugins: Pick<Plugin<any, A>, "isMine" | "isResolved">[],
  pluginConfigs: any[]
): Promise<AnnotatedComment<A>[]> {
  const expires: AnnotatedComment<A>[] = [];

  for (let comment of comments) {
    const index = comments.indexOf(comment);
    const pluginConfig = pluginConfigs[index];
    const resolver = plugins.find(({ isMine }) =>
      isMine(comment.annotation, pluginConfig)
    );
    if (!resolver) {
      throw new Error(`Unknown format: ${JSON.stringify(comment)}`);
    }

    if (await resolver.isResolved(comment, pluginConfig)) {
      expires.push(comment);
    }
  }

  return expires;
}
