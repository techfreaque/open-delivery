/* eslint-disable no-console */
/**
 * Global setup for all tests
 * This runs once before all test files
 */
import { PrismaClient } from "@prisma/client";

import seedTestDatabase from "./seed-test-db";
import { startServer } from "./test-server";

const prisma = new PrismaClient();

export async function setup(): Promise<{
  baseUrl: string;
}> {
  // First clean up database
  await cleanDatabase();

  // Start the test server
  const baseUrl = await startServer(4000);
  console.log(`Test server started at ${baseUrl}`);

  // Seed the database (only once)
  await seedTestDatabase();

  // Set global URL for all tests to use
  process.env.TEST_SERVER_URL = baseUrl;

  return {
    baseUrl,
  };
}

export async function teardown(): Promise<void> {
  await prisma.$disconnect();
}

async function cleanDatabase(): Promise<void> {
  // Clear all data to start fresh
  console.log("Cleaning database before tests...");

  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.earning.deleteMany({});
  await prisma.delivery.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.driver.deleteMany({});
  await prisma.userRole.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Database cleaned successfully");
}
