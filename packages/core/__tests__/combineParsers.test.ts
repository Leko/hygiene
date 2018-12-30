import { combineParsers } from "../src/combineParsers";

describe("combineParsers", () => {
  it("returns null when all plugins return null", async () => {
    const plugin = {
      async parse() {
        return null;
      }
    };
    const parse = combineParsers(plugin);
    expect(await parse("", {})).toBeNull();
  });
  it("returns first truthy value", async () => {
    const expected = {
      a: 1
    };
    const plugin1 = {
      async parse() {
        return null;
      }
    };
    const plugin2 = {
      async parse() {
        return expected;
      }
    };
    const parse = combineParsers(plugin1, plugin2);
    expect(await parse("", {})).toBe(expected);
  });
});
