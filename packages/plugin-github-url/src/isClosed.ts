import Octokit from "@octokit/rest";
import Bottleneck from "bottleneck";
import { Issue } from "./Annotation";

const cache = new Map();
const limiter = new Bottleneck({
  // Allow 5000 requests per hour
  // https://developer.github.com/v3/rate_limit/
  reservoir: 5000,
  reservoirRefreshAmount: 5000,
  reservoirRefreshInterval: 1000 * 60 * 60
});

export const isClosed = (client: Octokit) => ({
  owner,
  repo,
  number
}: Issue) => {
  const cacheKey = `${owner}/${repo}/${number}`;
  if (cache.has(cacheKey)) {
    return Promise.resolve(cache.get(cacheKey));
  }
  return limiter.wrap(() =>
    client.issues
      .get({ owner, repo, number })
      .then(({ data }) => data.state === "closed")
  )();
};
