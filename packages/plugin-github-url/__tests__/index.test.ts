import createPlugin, { TYPE } from "../src/index";

describe("plugin-github-url", () => {
  it("should have name property", () => {
    expect(createPlugin()).toBeTruthy();
  });
  describe("toMessage", () => {
    const annotation = {
      type: TYPE,
      issues: [
        {
          owner: "Leko",
          repo: "hygiene",
          number: 32
        }
      ]
    };
    it("generates message correctly", () => {
      expect(createPlugin().toMessage(annotation, {} as any)).toBe(
        "Leko/hygiene#32 has been closed"
      );
    });
  });
  describe("isMine", () => {
    it('returns true when annotation type is "github-url"', () => {
      const annotation = {
        type: TYPE,
        issues: []
      };
      expect(createPlugin().isMine(annotation, {} as any)).toBe(true);
    });
    it('returns true when annotation type is not "github-url"', () => {
      const annotation = {
        type: "hoge",
        issues: []
      };
      // @ts-ignore Type 'string' is not assignable to type '"github-url"'
      expect(createPlugin().isMine(annotation, {} as any)).toBe(false);
    });
  });

  describe("isResolved", () => {
    let originGithubToken: string | undefined;
    beforeEach(() => {
      originGithubToken = process.env.GITHUB_TOKEN;
    });
    afterEach(() => {
      process.env.GITHUB_TOKEN = originGithubToken;
    });
    it("throws error when the environment variable `GITHUB_TOKEN` not present", async () => {
      const comment = {
        annotation: {
          type: TYPE,
          issues: []
        },
        kind: "todo",
        file: "xxx/yyy.ts",
        line: 12,
        text: "hoge",
        codeFrame: "xxx"
      };

      delete process.env.GITHUB_TOKEN;
      expect(createPlugin().isResolved(comment, {} as any)).rejects.toThrow();
    });
  });

  describe("parse", () => {
    it("returns null when body not includes any reference", async () => {
      expect(
        await createPlugin().parse("", { repository: "Leko/hygiene" })
      ).toBeNull();
    });
    it("fills with options.repository when repository slug is not present", async () => {
      expect(
        await createPlugin().parse("#123", { repository: "Leko/hygiene" })
      ).toEqual({
        type: TYPE,
        issues: [
          {
            owner: "Leko",
            repo: "hygiene",
            number: 123
          }
        ]
      });
    });
    it("returns string prefixed by repository slug", async () => {
      const expected = {
        type: TYPE,
        issues: [
          {
            owner: "Leko",
            repo: "hygiene",
            number: 123
          }
        ]
      };
      expect(
        await createPlugin().parse("Leko/hygiene#123", {
          repository: "xxx/yyy"
        })
      ).toEqual(expected);
    });
    it("can parse url of GitHub issue", async () => {
      const expected = {
        type: TYPE,
        issues: [
          {
            owner: "Leko",
            repo: "hygiene",
            number: 123
          }
        ]
      };
      expect(
        await createPlugin().parse(
          "Waiting for https://github.com/Leko/hygiene/issues/123",
          {
            repository: "xxx/yyy"
          }
        )
      ).toEqual(expected);
    });
    it("can parse url of GitHub pull request", async () => {
      const expected = {
        type: TYPE,
        issues: [
          {
            owner: "Leko",
            repo: "hygiene",
            number: 321
          }
        ]
      };
      expect(
        await createPlugin().parse(
          "Waiting for https://github.com/Leko/hygiene/pull/321",
          {
            repository: "xxx/yyy"
          }
        )
      ).toEqual(expected);
    });
  });
});
