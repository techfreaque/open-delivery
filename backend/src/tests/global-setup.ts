/* eslint-disable no-console */
/**
 * Global setup for all tests
 * This runs once before all test files
 */
import { PrismaClient } from "@prisma/client";

import seedTestDatabase from "./seed-test-db";
import { startServer } from "./test-server";

// Create a single PrismaClient instance
const prisma = new PrismaClient();

export default async function setup() {
  try {
    // First clean up database
    await cleanDatabase();

    // Start the test server
    await startServer();

    // Seed the database (only once)
    await seedTestDatabase();

    // Set global URL for all tests to use

    // Return a teardown function that will be run after all tests
    return (): void => {
      console.log("Global setup teardown function called");
      // The actual teardown logic is in global-teardown.ts
    };
  } catch (error) {
    console.error("Error during test setup:", error);
    // Make sure to disconnect Prisma on error
    await prisma.$disconnect().catch(console.error);
    throw error;
  }
}

async function cleanDatabase(): Promise<void> {
  // Clear all data to start fresh
  console.log("Cleaning database before tests...");

  try {
    await prisma.$transaction([
      prisma.orderItem.deleteMany({}),
      prisma.order.deleteMany({}),
      prisma.cartItem.deleteMany({}),
      prisma.menuItem.deleteMany({}),
      prisma.earning.deleteMany({}),
      prisma.delivery.deleteMany({}),
      prisma.restaurant.deleteMany({}),
      prisma.driver.deleteMany({}),
      prisma.userRole.deleteMany({}),
      prisma.session.deleteMany({}),
      prisma.address.deleteMany({}),
      prisma.user.deleteMany({}),
    ]);

    console.log("Database cleaned successfully");
  } catch (error) {
    console.error("Error cleaning database:", error);
    throw error;
  }
}
