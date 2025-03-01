import { afterAll, beforeAll } from "vitest";

import { generateTestTokens, type TestAuthTokens } from "./auth-helpers";
import seedTestDatabase from "./seed-test-db";
import { startServer, stopServer } from "./test-server";

// Add at the beginning:
const DEBUG = process.env.DEBUG_TESTS === "true";

function debugLog(...args: any[]) {
  if (DEBUG) {
    console.log("[TEST DEBUG]", ...args);
  }
}

// Declare globals that will be available to all tests
declare global {
  var testTokens: TestAuthTokens;

  var customerAuthToken: string;

  var restaurantAuthToken: string;

  var driverAuthToken: string;

  var adminAuthToken: string;

  var testData: Record<string, any>;

  var testBaseUrl: string;
}

// Use a mutex pattern to ensure one DB seeding at a time
let setupComplete = false;
let setupPromise: Promise<void> | null = null;
let setupError: Error | null = null;

// Setup global test database
beforeAll(async () => {
  // If setup is already complete, just use the existing data
  if (setupComplete) {
    return;
  }

  // If setup is in progress, wait for it
  if (setupPromise) {
    return setupPromise;
  }

  // Create setup promise
  setupPromise = (async () => {
    try {
      debugLog(
        `Worker ${process.env.VITEST_WORKER_ID || "unknown"}: Starting setup...`,
      );

      // Start test server (using singleton pattern)
      const baseUrl = await startServer();
      global.testBaseUrl = baseUrl;

      try {
        // Seed test data
        const testData = await seedTestDatabase();
        global.testData = testData;

        // Generate test tokens after database is seeded
        const tokens = await generateTestTokens();
        global.testTokens = tokens;
        global.customerAuthToken = tokens.customerAuthToken;
        global.restaurantAuthToken = tokens.restaurantAuthToken;
        global.driverAuthToken = tokens.driverAuthToken;
        global.adminAuthToken = tokens.adminAuthToken;

        debugLog(
          `Worker ${process.env.VITEST_WORKER_ID || "unknown"}: Setup completed successfully`,
        );
        setupComplete = true;
      } catch (dbError) {
        console.error("Database seeding failed:", dbError);
        throw dbError;
      }
    } catch (error) {
      console.error(
        `Worker ${process.env.VITEST_WORKER_ID || "unknown"}: Setup failed:`,
        error,
      );
      setupError = error as Error;
      throw error;
    } finally {
      // Always set promise to null so we can retry if needed
      setupPromise = null;
    }
  })();

  return setupPromise;
});

// Cleanup after tests
afterAll(async () => {
  // Only stop the server if this is the last test file
  if (process.env.VITEST_WORKER_ID === "1") {
    await stopServer();
  }
});
