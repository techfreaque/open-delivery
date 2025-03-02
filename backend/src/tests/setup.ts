/* eslint-disable no-console */
import { PrismaClient, UserRoleValue } from "@prisma/client";
import { afterAll, beforeAll } from "vitest";

import { signJwt } from "@/lib/auth/jwt";
import { env } from "@/lib/env";

import { getBaseUrl } from "./test-server";

// Add at the beginning:
const DEBUG = env.DEBUG_TESTS === "true";

function debugLog(...args: unknown[]): void {
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
  var testData: Record<string, unknown>;
  var testBaseUrl: string;
}

const prisma = new PrismaClient();

// Setup global test database
beforeAll(async () => {
  try {
    // Get URL from environment (set by global-setup.ts)
    const testBaseUrl = getBaseUrl();

    // Get database entries needed for tests
    const users = await prisma.user.findMany();
    const customer = users.find(
      (user) => user.email === "customer@example.com",
    );
    const restaurant = await prisma.restaurant.findFirst();
    const restaurantOwner = users.find(
      (user) => user.email === "restaurant@example.com",
    );

    if (!customer || !restaurant || !restaurantOwner) {
      throw new Error(
        "Test data not found. Make sure database was seeded correctly.",
      );
    }

    // Create JWT tokens for testing using the proper auth library function
    debugLog(`Using JWT_SECRET_KEY: ${env.JWT_SECRET_KEY?.substring(0, 5)}...`);

    // Create customer token using proper signJwt function
    const customerToken = await signJwt({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      roles: [UserRoleValue.CUSTOMER],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create restaurant token using proper signJwt function
    const restaurantToken = await signJwt({
      id: restaurantOwner.id,
      email: restaurantOwner.email,
      name: restaurantOwner.name,
      roles: [UserRoleValue.RESTAURANT_ADMIN],
      createdAt: new Date(),
      updatedAt: new Date(),
      restaurantId: restaurant.id,
    });

    debugLog(
      `Generated customer token (first 30 chars): ${customerToken.substring(0, 30)}`,
    );

    // Expose test data and tokens to global scope
    global.testBaseUrl = testBaseUrl;
    global.testData = { customer, restaurant, restaurantOwner };
    global.customerAuthToken = customerToken;
    global.restaurantAuthToken = restaurantToken;
  } catch (error) {
    console.error("Test setup failed:", error);
    throw error;
  }
});

// Cleanup after tests
afterAll(async () => {
  await prisma.$disconnect();
});

interface TestAuthTokens {
  customerAuthToken: string;
  restaurantAuthToken: string;
  driverAuthToken: string;
  adminAuthToken: string;
}
