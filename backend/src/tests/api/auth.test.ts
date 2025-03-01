/* eslint-disable no-console */

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { getBaseUrl } from "../test-server";

// Setup
const prisma = new PrismaClient();
const baseUrl = getBaseUrl();

describe("Auth API", () => {
  const testUser = {
    name: "E2E Test User",
    email: "e2e-test@example.com",
    password: "Password123!",
  };

  let userId: string;
  let userToken: string;

  // Setup: Create test user
  beforeAll(async () => {
    // Clean up any existing test user
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });

    // Create a new test user with hashed password
    const hashedPassword = await hash(testUser.password, 10);
    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
        userRoles: {
          create: [{ role: "CUSTOMER" }],
        },
      },
    });

    userId = user.id;
  });

  // Cleanup after tests
  afterAll(async () => {
    try {
      await prisma.userRole.deleteMany({
        where: { userId },
      });
      await prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      console.error("Error cleaning up test user:", error);
    }
    await prisma.$disconnect();
  });

  describe("POST /api/auth/login", () => {
    it("should authenticate a user with valid credentials", async () => {
      const response = await request(baseUrl).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);

      // Store token for later tests
      userToken = response.body.token;
    });

    it("should reject authentication with invalid credentials", async () => {
      const response = await request(baseUrl).post("/api/auth/login").send({
        email: testUser.email,
        password: "WrongPassword123!",
      });

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return user data when authenticated", async () => {
      const response = await request(baseUrl)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
    });

    it("should reject unauthorized requests", async () => {
      const response = await request(baseUrl).get("/api/auth/me");
      expect(response.status).toBe(401);
    });
  });
});
