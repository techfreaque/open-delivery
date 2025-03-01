/* eslint-disable no-console */

import "../setup"; // Import to ensure global tokens are available

import type { MenuItem } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { MenuItemInput } from "@/types/types";

import { getBaseUrl } from "../test-server";

// Use real Prisma client for E2E tests
const prisma = new PrismaClient();
const baseUrl = getBaseUrl();

describe("/api/restaurants E2E", () => {
  let restaurantId: string;

  beforeAll(async () => {
    // Get test restaurant ID
    const restaurant = await prisma.restaurant.findFirst();
    restaurantId = restaurant?.id || "testrestaurant";
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/restaurants", () => {
    it("should return a list of restaurants", async () => {
      const response = await request(baseUrl)
        .get("/api/restaurants")
        .set("Authorization", `Bearer ${global.customerAuthToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return restaurants filtered by cuisine", async () => {
      const response = await request(baseUrl)
        .get("/api/restaurants?category=Italian")
        .set("Authorization", `Bearer ${global.customerAuthToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/restaurants/:id", () => {
    it("should return a specific restaurant", async () => {
      const response = await request(baseUrl)
        .get(`/api/restaurants/${restaurantId}`)
        .set("Authorization", `Bearer ${global.customerAuthToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id as string).toBe(restaurantId);
    });

    it("should return 404 for non-existent restaurant", async () => {
      const response = await request(baseUrl)
        .get("/api/restaurants/non-existent-id")
        .set("Authorization", `Bearer ${global.customerAuthToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("POST /api/restaurants/menu", () => {
    let newMenuItem: MenuItemInput;

    it("should create a new menu item as restaurant owner", async () => {
      // Create a new menu item for the restaurant
      newMenuItem = {
        name: "E2E Test Item",
        description: "Created during E2E testing",
        price: 14.99,
        category: "Appetizer",
        image: "/test-image.jpg",
        restaurantId,
      };

      const response = await request(baseUrl)
        .post(`/api/restaurants/menu`)
        .set("Authorization", `Bearer ${global.restaurantAuthToken}`)
        .send(newMenuItem);

      expect(response.status).toBe(200);
      const responseBody = response.body as MenuItem;
      expect(responseBody.name).toBe(newMenuItem.name);

      // Save the ID for cleanup
      newMenuItem = { ...newMenuItem, id: responseBody.id };
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
