/* eslint-disable no-console */

import { PrismaClient, type Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Seeds the test database with standard test data
 */
async function seedTestDatabase(): Promise<void> {
  console.log("Seeding test database...");

  try {
    // Clear existing data
    await prisma.userRole.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.restaurant.deleteMany({});
    await prisma.menuItem.deleteMany({});

    // Create test password
    const testPassword = await hash("password123", 10);

    // Create test users
    const testCustomer = await prisma.user.create({
      data: {
        id: "customer-user",
        name: "Test Customer",
        email: "customer@example.com",
        password: testPassword,
      },
    });

    const testRestaurant = await prisma.user.create({
      data: {
        id: "restaurant-user",
        name: "Test Restaurant User",
        email: "restaurant@example.com",
        password: testPassword,
      },
    });

    const testAdmin = await prisma.user.create({
      data: {
        id: "admin-user",
        name: "Test Admin",
        email: "admin@example.com",
        password: testPassword,
      },
    });

    // Create user roles
    await prisma.userRole.create({
      data: {
        userId: testCustomer.id,
        role: "CUSTOMER" as Role,
      },
    });

    await prisma.userRole.create({
      data: {
        userId: testRestaurant.id,
        role: "RESTAURANT_ADMIN" as Role,
      },
    });

    await prisma.userRole.create({
      data: {
        userId: testAdmin.id,
        role: "ADMIN" as Role,
      },
    });

    // Create test restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        id: "testrestaurant",
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

    // Create test menu items
    await prisma.menuItem.create({
      data: {
        id: "testmenuitem",
        name: "Test Pizza",
        description: "A delicious test pizza",
        price: 12.99,
        category: "Main",
        image: "/test-food.jpg",
        restaurantId: restaurant.id,
      },
    });

    console.log("Test database seeded successfully!");
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
