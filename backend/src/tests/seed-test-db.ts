/* eslint-disable no-console */

import { PrismaClient, type UserRoleValue } from "@prisma/client";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

/**
 * Seeds the test database with standard test data
 */
async function seedTestDatabase(): Promise<Record<string, unknown>> {
  console.log("Seeding test database...");

  try {
    console.log("Clearing existing test data...");

    // Fix: Use sequential deletes rather than transaction
    // This is safer when we don't know all constraints
    try {
      // Delete tables in reverse order of dependency
      await prisma.orderItem.deleteMany();
      console.log("Cleared orderItems");

      await prisma.order.deleteMany();
      console.log("Cleared orders");

      await prisma.cartItem.deleteMany();
      console.log("Cleared cartItems");

      await prisma.menuItem.deleteMany();
      console.log("Cleared menuItems");

      // Check if the earning table exists before trying to clear it
      // This will help diagnose schema issues
      try {
        await prisma.earning.deleteMany();
        console.log("Cleared earnings");
      } catch (err) {
        console.log("Error clearing earnings table:", err);
        // Continue anyway - this table might be misconfigured
      }

      await prisma.delivery.deleteMany();
      console.log("Cleared deliveries");

      await prisma.restaurant.deleteMany();
      console.log("Cleared restaurants");

      await prisma.driver.deleteMany();
      console.log("Cleared drivers");

      await prisma.userRole.deleteMany();
      console.log("Cleared userRoles");

      await prisma.session.deleteMany();
      console.log("Cleared sessions");

      await prisma.address.deleteMany();
      console.log("Cleared addresses");

      await prisma.user.deleteMany();
      console.log("Cleared users");
    } catch (clearError) {
      console.error("Error during database clearing:", clearError);
      // Continue with seeding - in test environment we can proceed
    }

    // Generate unique IDs for this test run to avoid conflicts
    const testIdPrefix = uuidv4().substring(0, 8);

    console.log("Creating test users...");
    // Create test password
    const testPassword = await hash("password123", 10);

    // Use upsert instead of create to handle multiple test workers
    const testCustomer = await prisma.user.upsert({
      where: { email: "customer@example.com" },
      update: {
        // Only update if needed
        name: "Test Customer",
        // Don't re-hash password on update
      },
      create: {
        id: `customer-${testIdPrefix}`,
        name: "Test Customer",
        email: "customer@example.com",
        password: testPassword,
      },
    });

    const testRestaurant = await prisma.user.upsert({
      where: { email: "restaurant@example.com" },
      update: { name: "Test Restaurant User" },
      create: {
        id: `restaurant-${testIdPrefix}`,
        name: "Test Restaurant User",
        email: "restaurant@example.com",
        password: testPassword,
      },
    });

    const testDriver = await prisma.user.upsert({
      where: { email: "driver@example.com" },
      update: { name: "Test Driver" },
      create: {
        id: `driver-${testIdPrefix}`,
        name: "Test Driver",
        email: "driver@example.com",
        password: testPassword,
      },
    });

    const testAdmin = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: { name: "Test Admin" },
      create: {
        id: `admin-${testIdPrefix}`,
        name: "Test Admin",
        email: "admin@example.com",
        password: testPassword,
      },
    });

    console.log("Creating user roles...");
    // First delete existing roles to avoid duplicates
    await prisma.userRole.deleteMany({
      where: {
        userId: {
          in: [testCustomer.id, testRestaurant.id, testDriver.id, testAdmin.id],
        },
      },
    });

    // Create user roles
    await prisma.userRole.create({
      data: {
        userId: testCustomer.id,
        role: "CUSTOMER" as UserRoleValue,
      },
    });

    await prisma.userRole.create({
      data: {
        userId: testRestaurant.id,
        role: "RESTAURANT_ADMIN" as UserRoleValue,
      },
    });

    await prisma.userRole.create({
      data: {
        userId: testDriver.id,
        role: "DRIVER" as UserRoleValue,
      },
    });

    await prisma.userRole.create({
      data: {
        userId: testAdmin.id,
        role: "ADMIN" as UserRoleValue,
      },
    });

    console.log("Creating test restaurant...");
    // Create test restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        id: `restaurant-${testIdPrefix}`,
        name: "Test Restaurant",
        description: "Restaurant for testing",
        address: "123 Test Street",
        userId: testRestaurant.id,
        image: "/test-image.jpg",
        rating: 4.5,
        phone: "555-123-4567",
        email: "restaurant@example.com",
        cuisine: "Italian",
      },
    });

    console.log("Creating test menu items...");
    // Create test menu items
    const menuItem = await prisma.menuItem.create({
      data: {
        id: `menuitem-${testIdPrefix}`,
        name: "Test Pizza",
        description: "A delicious test pizza",
        price: 12.99,
        category: "Main",
        image: "/test-food.jpg",
        restaurantId: restaurant.id,
      },
    });

    console.log("Test database seeded successfully!");

    // Return data that tests might need
    const testData = {
      users: {
        customer: testCustomer,
        restaurant: testRestaurant,
        driver: testDriver,
        admin: testAdmin,
      },
      restaurant,
      menuItem,
    };

    return testData;
  } catch (error) {
    console.error("Error seeding test database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  // Only run when directly executed
  void seedTestDatabase().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export default seedTestDatabase;
