module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePaths: ["<rootDir>"],
  globals: {
    "ts-jest": {
      tsconfig: "test/tsconfig.json",
    },
  },
};
