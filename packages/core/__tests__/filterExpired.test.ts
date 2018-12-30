import { filterExpired } from "../src/filterExpired";

describe("filterExpired", () => {
  it("returns empty array when comments are empty", async () => {
    const plugin = {
      isMine() {
        return true;
      },
      async isResolved() {
        return true;
      }
    };
    // @ts-ignore Signature '(annotation: {}, config: any): boolean' must be a type predicate.
    expect(await filterExpired([], [plugin], [{}])).toEqual([]);
  });
  it("throws error when all plugins return false on isMine", async () => {
    const comments = [
      {
        annotation: null,
        kind: "todo",
        file: "xxx/yyy.ts",
        line: 12,
        text: "hoge",
        codeFrame: "xxx"
      }
    ];
    const plugin = {
      isMine() {
        return false;
      },
      async isResolved() {
        return true;
      }
    };
    await expect(
      // @ts-ignore Signature '(annotation: {}, config: any): boolean' must be a type predicate.
      filterExpired(comments, [plugin], [{}])
    ).rejects.toThrow(/Unknown format/);
  });
});
