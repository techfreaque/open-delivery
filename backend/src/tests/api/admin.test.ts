/* eslint-disable no-console */

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { startServer } from "../test-server";
import { getTestToken } from "../utils";

// Use real Prisma client
const prisma = new PrismaClient();

describe("/api/admin E2E", () => {
  let adminToken: string;
  let customerToken: string;
  let testUserId: string;
  let baseUrl: string;

  beforeAll(async () => {
    // Start the test server
    baseUrl = await startServer();
    console.log(`Admin test running against: ${baseUrl}`);

    // Create a temporary test user for admin operations
    const tempUser = await prisma.user.create({
      data: {
        id: "temp-test-user",
        name: "Temporary Test User",
        email: "temp-test@example.com",
        password: await hash("testpassword", 10),
        userRoles: {
          create: [{ role: "CUSTOMER" }],
        },
      },
    });

    testUserId = tempUser.id;

    // Use simple test tokens instead of login
    adminToken = getTestToken("ADMIN");
    customerToken = getTestToken("CUSTOMER");
  });

  afterAll(async () => {
    // Clean up our temp user if it wasn't deleted during tests
    try {
      await prisma.userRole.deleteMany({
        where: { userId: "temp-test-user" },
      });
      await prisma.user.delete({
        where: { id: "temp-test-user" },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // User might have been deleted already by the test
    }

    await prisma.$disconnect();
  });

  describe("GET /api/admin/users", () => {
    it("should return a list of users when authenticated as admin", async () => {
      const response = await request(baseUrl)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`);

      // Debug output
      if (response.status !== 200) {
        console.log("Response body:", response.body);
      }

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should deny access when not authenticated as admin", async () => {
      const response = await request(baseUrl)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(response.status).toBe(401);
    });
  });

  describe("DELETE /api/admin/users/:id", () => {
    it("should delete a user", async () => {
      const response = await request(baseUrl)
        .delete(`/api/admin/users/${testUserId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      // Debug output
      if (response.status !== 200) {
        console.log("Delete response:", response.body);
      }

      expect(response.status).toBe(200);

      // Verify user was actually deleted from DB
      const deletedUser = await prisma.user.findUnique({
        where: { id: testUserId },
      });
      expect(deletedUser).toBeNull();
    });
  });
});
