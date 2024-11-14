import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  bundle: false, // prevent bundling into a single file
  treeshake: true,
  sourcemap: false,
  clean: true,
});
