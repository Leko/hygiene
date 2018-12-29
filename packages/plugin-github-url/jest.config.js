const base = require("../../jest.config.base");

module.exports = {
  ...base,
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  testMatch: ["**/__tests__/*.+(ts|tsx|js)"]
};
