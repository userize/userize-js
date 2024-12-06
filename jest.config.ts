module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePaths: ["<rootDir>"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "test/tsconfig.json" }],
  },
};
