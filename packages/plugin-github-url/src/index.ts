import identity from "lodash/identity";
import { sync as origin } from "remote-origin-url";
import parseGitUrl from "git-url-parse";
import parser from "issue-parser";
import { sync as findUp } from "find-up";
import Octokit from "@octokit/rest";
import { AnnotatedComment, Plugin } from "@hygiene/core";
import { TYPE, Annotation } from "./Annotation";
import { isClosed } from "./isClosed";

interface Option {
  repository: string;
}

const parseReferences = parser("github");

export { TYPE };

export default (): Plugin<Option, Annotation> => ({
  name: TYPE,

  toMessage(annotation: Annotation): string {
    const { issues } = annotation;
    const slugs = issues.map(
      issue => `${issue.owner}/${issue.repo}#${issue.number}`
    );
    const message =
      issues.length <= 2
        ? slugs.join(", ")
        : `${slugs.slice(0, -1).join(", ")} and ${slugs[slugs.length - 1]}`;

    return `${message} has been closed`;
  },

  getConfigDefinition() {
    const gitDir = findUp(".git");
    // FIXME: https://github.com/jonschlinkert/remote-origin-url/issues/2
    const remoteUrl = gitDir ? origin(`${gitDir}/config`) : null;
    const github = remoteUrl ? parseGitUrl(remoteUrl) : null;

    return {
      repository: {
        describe: "Specify current repository. ex. `owner/repo`",
        type: "string",
        default: github ? github.full_name : null
      }
    };
  },

  isMine(annotation: Annotation): annotation is Annotation {
    return annotation.type === TYPE;
  },

  async isResolved(comment: AnnotatedComment<Annotation>): Promise<boolean> {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error("Environment variable GITHUB_TOKEN must be required");
    }
    const token = process.env.GITHUB_TOKEN;
    const client = new Octokit();

    client.authenticate({ type: "token", token });

    return Promise.all(comment.annotation.issues.map(isClosed(client))).then(
      results => results.every(identity)
    );
  },

  parse(body: string, option: Option): Promise<Annotation | null> {
    const issues = parseReferences(body)
      .allRefs.filter(ref => !!ref.issue)
      .map(ref => ({
        ...ref,
        slug: ref.slug || option.repository
      }))
      .map(ref => {
        const [owner, repo] =
          typeof ref.slug === "string" ? ref.slug.split("/") : ["", ""];

        return {
          owner,
          repo,
          number: parseInt(ref.issue, 10)
        };
      });

    const ret = issues.length > 0 ? { type: TYPE, issues } : null;
    return Promise.resolve(ret);
  }
});
