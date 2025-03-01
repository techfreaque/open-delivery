// vitest.config.ts
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./src/tests/setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    globals: true,
    coverage: {
      reporter: ["text", "html"],
      exclude: ["node_modules/", "src/tests/setup.ts"],
    },
    testTimeout: 30000, // 30 seconds for API tests
  },
});
