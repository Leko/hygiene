import { text } from "../../src/reporter/text";

describe("reporter", () => {
  describe("text", () => {
    it("reports count of errors", () => {
      const spyLog = jest.spyOn(console, "log");
      spyLog.mockImplementation(x => x);

      text([]);
      expect(spyLog.mock.calls[0][0]).toMatch(/0 errors found/);
    });
    it("reports message group by path of file", () => {
      const spyLog = jest.spyOn(console, "log");
      spyLog.mockImplementation(x => x);

      const dummy = {
        text: "waiting for hoge",
        message: "some message",
        ruleName: "test",
        kind: "TODO"
      };

      text([
        {
          file: "xxx/yyy/zzz.js",
          line: 345,
          ...dummy
        },
        {
          file: "yyy/yyy/yyy.ts",
          line: 234,
          ...dummy
        },
        {
          file: "xxx/yyy/zzz.js",
          line: 123,
          ...dummy
        }
      ]);
      expect(spyLog.mock.calls.map(args => args.join(" ")).join("\n")).toBe(`
xxx/yyy/zzz.js
  123: some message (test)
  345: some message (test)

yyy/yyy/yyy.ts
  234: some message (test)

3 errors found`);
    });
  });
});
