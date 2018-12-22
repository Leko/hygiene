export const TYPE = "github-url" as "github-url";

export type Issue = {
  owner: string;
  repo: string;
  number: number;
};

export type Annotation = {
  type: typeof TYPE;
  issues: Issue[];
};
