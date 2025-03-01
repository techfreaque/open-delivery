/* eslint-disable no-console */

import type { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken"; // Add this import for the sign function
import request from "supertest";

import { getBaseUrl } from "./test-server";

// Secret key for testing
const TEST_JWT_SECRET = "test-secret-key-for-e2e-tests";

// Remove mock-related functions and implement real authentication
export interface UserCredentials {
  email: string;
  password: string;
}

/**
 * Creates a test user with the specified role and returns credentials
 */
export async function createTestUser(
  prisma: PrismaClient,
  name: string,
  role: UserRole,
): Promise<UserCredentials> {
  const email = `${name.toLowerCase().replace(/\s+/g, "")}@example.com`;
  const password = "Password123!";

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { email, password };
  }

  // Create a new user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await hash(password, 10),
    },
  });

  // Assign role to the user
  await prisma.userRole.create({
    data: {
      userId: user.id,
      role,
    },
  });

  return { email, password };
}

/**
 * Performs actual login using the API and returns the token
 */
export async function loginUser(credentials: UserCredentials): Promise<string> {
  try {
    const baseUrl = getBaseUrl();

    const response = await request(baseUrl).post("/api/auth/login").send({
      email: credentials.email,
      password: credentials.password,
    });

    if (response.status !== 200) {
      console.error("Login failed:", response.body);
      throw new Error(`Login failed with status ${response.status}`);
    }

    // Extract token from cookies or response body
    const cookies = response.headers["set-cookie"] || [];
    const tokenCookie = cookies.find((cookie: string) =>
      cookie.startsWith("token="),
    );

    if (tokenCookie) {
      // Extract token from cookie
      const match = tokenCookie.match(/token=([^;]+)/);
      if (match && match[1]) {
        return match[1];
      }
    }

    // If token is in response body
    if (response.body.token) {
      return response.body.token as string;
    }

    // Look for user with token in body
    if (response.body.user?.token) {
      return response.body.user.token as string;
    }

    throw new Error("Could not extract token from response");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * Helper to seed test data using the real database
 */
export async function seedTestData(prisma: PrismaClient): Promise<void> {
  console.log("Seeding test data...");

  try {
    // Create test users
    await createTestUser(prisma, "Test Customer", "CUSTOMER");
    await createTestUser(prisma, "Test Restaurant", "RESTAURANT_ADMIN");
    await createTestUser(prisma, "Test Admin", "ADMIN");

    // Create a test restaurant
    const restaurantUser = await prisma.user.findUnique({
      where: { email: "testrestaurant@example.com" },
    });

    if (restaurantUser) {
      const restaurant = await prisma.restaurant.findFirst({
        where: { userId: restaurantUser.id },
      });

      if (!restaurant) {
        await prisma.restaurant.create({
          data: {
            id: "testrestaurant",
            name: "Test Restaurant",
            description: "Restaurant for testing",
            address: "123 Test Street",
            category: "Italian",
            userId: restaurantUser.id,
            image: "/test-image.jpg",
            rating: 4.5,
          },
        });
      }

      // Create a menu item
      const testRestaurant = await prisma.restaurant.findFirst({
        where: { userId: restaurantUser.id },
      });

      if (testRestaurant) {
        const menuItem = await prisma.menuItem.findFirst({
          where: { restaurantId: testRestaurant.id },
        });

        if (!menuItem) {
          await prisma.menuItem.create({
            data: {
              id: "testmenuitem",
              name: "Test Pizza",
              description: "A delicious test pizza",
              price: 12.99,
              category: "Main",
              image: "/test-food.jpg",
              restaurantId: testRestaurant.id,
            },
          });
        }
      }
    }

    console.log("Test data seeding completed");
  } catch (error) {
    console.error("Error seeding test data:", error);
    throw error;
  }
}

/**
 * Helper function to clean up test data
 */
export async function cleanupTestData(
  prisma: PrismaClient,
  where: Record<string, unknown>,
): Promise<void> {
  await prisma.menuItem.deleteMany({ where });
}

/**
 * Generates a test JWT token with specified roles
 */
export function generateTestToken(userId: string, roles: UserRole[]): string {
  return jwt.sign(
    // Use jwt.sign instead of undefined sign function
    {
      sub: userId,
      name: `Test ${roles[0].toLowerCase()} User`,
      email: `test-${roles[0].toLowerCase()}@example.com`,
      roles,
    },
    TEST_JWT_SECRET,
    { expiresIn: "1d" },
  );
}

/**
 * Returns a test token for the specified role
 */
export function getTestToken(role: UserRole): string {
  const roleMap: Record<UserRole, string> = {
    ADMIN: "admin-user",
    CUSTOMER: "customer-user",
    RESTAURANT_ADMIN: "restaurant-user",
    DRIVER: "driver-user",
    RESTAURANT: "restaurant-user",
    RESTAURANT_EMPLOYEE: "restaurant-employee",
  };

  const userId = roleMap[role] || `${role.toLowerCase()}-user`;
  return generateTestToken(userId, [role]);
}

/**
 * Returns all needed test tokens for comprehensive testing
 */
export function getAllTestTokens(): TestTokens {
  return {
    customerAuthToken: getTestToken("CUSTOMER"),
    restaurantAuthToken: getTestToken("RESTAURANT_ADMIN"),
    adminAuthToken: getTestToken("ADMIN"),
    driverAuthToken: getTestToken("DRIVER"),
  };
}
