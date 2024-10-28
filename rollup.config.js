import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.ts", // Your main TypeScript entry file
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      exports: "default",
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
    },
    {
      file: "dist/index.umd.js",
      format: "umd",
      name: "MyApiClient", // The global variable name for UMD
      globals: {
        axios: "axios", // example: if using axios for HTTP requests
      },
    },
  ],
  plugins: [
    resolve(), // so Rollup can find external dependencies
    commonjs(), // converts CommonJS modules to ES6
    typescript(), // compiles TypeScript
  ],
  external: ["axios"], // Exclude dependencies from the UMD build (if needed)
};
