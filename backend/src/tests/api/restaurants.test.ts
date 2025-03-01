/* eslint-disable no-console */

import "../setup"; // Import test setup

import type { MenuItem } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

// Use real Prisma client for E2E tests
const prisma = new PrismaClient();

describe("/api/restaurants E2E", () => {
  let restaurantId: string;

  beforeEach(() => {
    // Ensure test data exists
    if (!global.testData || !global.testData.restaurant) {
      console.log("Waiting for test data to be available...");
      return new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          if (global.testData && global.testData.restaurant) {
            restaurantId = global.testData.restaurant.id;
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    }

    // Get restaurant ID from global test data
    restaurantId = global.testData.restaurant.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/restaurants", () => {
    it("should return a list of restaurants", async () => {
      const response = await request(global.testBaseUrl)
        .get("/api/restaurants")
        .set("Authorization", `Bearer ${global.customerAuthToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return restaurants filtered by cuisine", async () => {
      const response = await request(global.testBaseUrl)
        .get("/api/restaurants?category=Italian")
        .set("Authorization", `Bearer ${global.customerAuthToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/restaurants/:id", () => {
    it("should return a specific restaurant", async () => {
      const response = await request(global.testBaseUrl)
        .get(`/api/restaurants/${restaurantId}`)
        .set("Authorization", `Bearer ${global.customerAuthToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(restaurantId);
    });

    it("should return 404 for non-existent restaurant", async () => {
      const response = await request(global.testBaseUrl)
        .get("/api/restaurants/non-existent-id")
        .set("Authorization", `Bearer ${global.customerAuthToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("POST /api/restaurants/menu", () => {
    let newMenuItem: Partial<MenuItem>;

    it("should create a new menu item as restaurant owner", async () => {
      // Create a new menu item for the restaurant
      newMenuItem = {
        name: "E2E Test Item",
        description: "Created during E2E testing",
        price: 14.99,
        category: "Appetizer",
        image: "/test-image.jpg",
        restaurantId,
        isAvailable: true,
      };

      const response = await request(global.testBaseUrl)
        .post(`/api/restaurants/menu`)
        .set("Authorization", `Bearer ${global.restaurantAuthToken}`)
        .send(newMenuItem);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(newMenuItem.name);

      // Save the ID for cleanup
      newMenuItem.id = response.body.id;
    });

    // Clean up - remove the created menu item
    afterAll(async () => {
      if (newMenuItem?.id) {
        try {
          await prisma.menuItem.delete({
            where: { id: newMenuItem.id },
          });
        } catch (error) {
          console.error("Error cleaning up test menu item:", error);
        }
      }
    });
  });
});
