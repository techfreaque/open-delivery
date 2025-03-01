/* eslint-disable no-console */

import "../setup"; // Import to ensure global tokens are available

import type { Order } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { startServer, stopServer } from "../test-server";

// Use real Prisma client
const prisma = new PrismaClient();

describe("/api/orders E2E", () => {
  let baseUrl: string;
  let restaurantId: string;
  let menuItemId: string;
  let createdOrderId: string;

  beforeAll(async () => {
    // Start the real test server
    baseUrl = await startServer();
    console.log(`E2E tests running against: ${baseUrl}`);

    // Use the restaurant and menu items from our test seed
    restaurantId = "testrestaurant";

    // Get the first menu item
    const menuItem = await prisma.menuItem.findFirst({
      where: { restaurantId },
    });
    menuItemId = menuItem?.id || "testmenuitem";
  });

  afterAll(async () => {
    // Clean up any created orders
    if (createdOrderId) {
      try {
        await prisma.order.delete({
          where: { id: createdOrderId },
        });
      } catch (error) {
        console.log("Order might have been already deleted", error);
      }
    }

    await stopServer();
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

      const response = await request(baseUrl)
        .post("/api/orders")
        .set("Authorization", `Bearer ${global.customerAuthToken}`)
        .send(newOrder);

      expect(response.status).toBe(200);
      const responseOrder = response.body as Order;
      expect(responseOrder.id).toBeDefined();
      expect(responseOrder.restaurantId).toBe(restaurantId);

      // Save order ID for cleanup
      createdOrderId = responseOrder.id;
    });
  });

  describe("GET /api/orders", () => {
    it("should return customer orders when authenticated as customer", async () => {
      const response = await request(baseUrl)
        .get("/api/orders")
        .set("Authorization", `Bearer ${global.customerAuthToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return restaurant orders when authenticated as restaurant admin", async () => {
      const response = await request(baseUrl)
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

      const response = await request(baseUrl)
        .get(`/api/orders/${createdOrderId}`)
        .set("Authorization", `Bearer ${global.customerAuthToken}`);

      expect(response.status).toBe(200);
      const responseOrder = response.body as Order;
      expect(responseOrder.id).toBe(createdOrderId);
    });
  });
});
