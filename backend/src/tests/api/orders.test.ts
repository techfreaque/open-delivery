/* eslint-disable no-console */

import "../setup"; // Import test setup

import { PrismaClient } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

// Use real Prisma client for E2E tests
const prisma = new PrismaClient();

describe("/api/orders E2E", () => {
  let restaurantId: string;
  let menuItemId: string;
  let createdOrderId: string;

  beforeEach(() => {
    // Get test data from global setup
    restaurantId = global.testData.restaurant.id;
    menuItemId = global.testData.menuItem.id;
  });

  afterAll(async () => {
    // Clean up created order if any
    if (createdOrderId) {
      try {
        await prisma.orderItem.deleteMany({
          where: { orderId: createdOrderId },
        });
        await prisma.order.delete({
          where: { id: createdOrderId },
        });
      } catch (error) {
        console.error("Error cleaning up test order:", error);
      }
    }

    await prisma.$disconnect();
  });

  describe("POST /api/orders", () => {
    it("should create a new order", async () => {
      const newOrder = {
        restaurantId,
        items: [{ menuItemId, quantity: 2 }],
        total: 25.98,
        address: "123 Test Address St",
        paymentMethod: "CASH",
      };

      const response = await request(global.testBaseUrl)
        .post("/api/orders")
        .set("Authorization", `Bearer ${global.customerAuthToken}`)
        .send(newOrder);

      expect(response.status).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.restaurantId).toBe(restaurantId);

      // Save order ID for cleanup
      createdOrderId = response.body.id;
    });
  });

  describe("GET /api/orders", () => {
    it("should return customer orders when authenticated as customer", async () => {
      const response = await request(global.testBaseUrl)
        .get("/api/orders")
        .set("Authorization", `Bearer ${global.customerAuthToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return restaurant orders when authenticated as restaurant admin", async () => {
      const response = await request(global.testBaseUrl)
        .get("/api/orders")
        .set("Authorization", `Bearer ${global.restaurantAuthToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/orders/:id", () => {
    it("should return an order by ID", async () => {
      // Skip if we didn't create an order
      if (!createdOrderId) {
        console.log("Skipping test because no order was created");
        return;
      }

      const response = await request(global.testBaseUrl)
        .get(`/api/orders/${createdOrderId}`)
        .set("Authorization", `Bearer ${global.customerAuthToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdOrderId);
    });
  });
});
