import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      // Make sure the path is absolute to avoid resolution issues
      "server-only": resolve(__dirname, "./src/tests/mocks/server-only.ts"),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./src/tests/setup.ts"],
    globals: true,
    globalSetup: ["./src/tests/global-setup.ts"],
    globalTeardown: "./src/tests/global-teardown.ts",
    testTimeout: 30000, // 30 seconds timeout for tests
    hookTimeout: 30000, // 30 seconds timeout for hooks
    // Run tests sequentially to avoid concurrency issues with the server
    sequence: {
      hooks: "list", // Run hooks in sequence
      setup: "parallel", // But setup can be in parallel
    },
    mockReset: true,
    clearMocks: true,
    // Add restoreMocks to ensure mocks are properly reset between tests
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/tests/mocks/**"],
    },
  },
});
