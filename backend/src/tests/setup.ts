import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll } from "vitest";

import type { TestTokens } from "@/types/types";

import seedTestDatabase from "./seed-test-db";
import { startServer, stopServer } from "./test-server";
import { getAllTestTokens } from "./utils";

// Create a global Prisma instance for tests
export const prisma = new PrismaClient();

// Export test tokens for use in tests
export const testTokens: TestTokens = getAllTestTokens();

// Setup global test database
beforeAll(async () => {
  // Start the test server
  await startServer();

  // Seed the test database
  await seedTestDatabase();
});

// Cleanup after tests
afterAll(async () => {
  await stopServer();
  await prisma.$disconnect();
});

// Make tokens globally available for tests
declare global {
  var customerAuthToken: string;

  var restaurantAuthToken: string;

  var adminAuthToken: string;

  var driverAuthToken: string;
}

// Assign tokens to global variables for easier test access
global.customerAuthToken = testTokens.customerAuthToken;
global.restaurantAuthToken = testTokens.restaurantAuthToken;
global.adminAuthToken = testTokens.adminAuthToken;
global.driverAuthToken = testTokens.driverAuthToken;
