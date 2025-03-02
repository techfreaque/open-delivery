// vitest.config.ts
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    // globalSetup: "./src/tests/setup.ts",
    setupFiles: ["./src/tests/setup.ts"],
    include: ["src/**/*.test.ts"],
    isolate: false,
    sequence: {
      hooks: "list", // Run hooks in sequence
      setupFiles: "list", // Run setup files in sequence
    },
    testTimeout: 30000,
  },
});
