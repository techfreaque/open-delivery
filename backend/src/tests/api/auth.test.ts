/* eslint-disable no-console */

import "../setup"; // Import test setup

import request from "supertest";
import { describe, expect, it } from "vitest";

import { env } from "@/lib/env";
import type {
  ErrorResponse,
  LoginResponseType,
  SuccessResponse,
  UserResponseType,
} from "@/types/types";

describe("Auth API", () => {
  // Storage for test-generated auth tokens
  let customerAuthToken: string;

  describe("POST /api/v1/auth/login", () => {
    it("should authenticate a user with valid credentials", async () => {
      const response = await request(env.TEST_SERVER_URL)
        .post("/api/v1/auth/login")
        .send({
          email: "customer@example.com",
          password: "password",
        });
      const responseData = response.body as SuccessResponse<LoginResponseType>;
      // Log response for debugging
      if (response.status !== 200) {
        console.log("Auth/me response:", response.body);
      }

      expect([200]).toContain(response.status);
      expect(responseData).toHaveProperty("success", true);
      expect(responseData).toHaveProperty("data");
      expect(responseData.data).toHaveProperty("token");
      expect(responseData.data).toHaveProperty("user");
      expect(responseData.data).toHaveProperty("expiresAt");

      // Store token
      customerAuthToken = responseData.data!.token;
      global.customerAuthToken = customerAuthToken;
      console.log(
        "[TEST DEBUG] Generated customer token (first 30 chars):",
        customerAuthToken?.substring(0, 30),
      );
    });

    it("should reject authentication with invalid credentials", async () => {
      const response = await request(env.TEST_SERVER_URL)
        .post("/api/v1/auth/login")
        .send({
          email: "customer@example.com",
          password: "wrongPassword",
        });
      // Log response for debugging
      if (response.status !== 401) {
        console.log("Auth/me response:", response.body);
      }

      // API should return 401 for invalid credentials
      expect(response.status).toBe(401);
      const responseData = response.body as ErrorResponse;
      expect(responseData).toHaveProperty("success", false);
      expect(responseData.message).toContain("Invalid email or password");
    });
  });

  describe("GET /api/v1/auth/me", () => {
    it("should return user data when authenticated", async () => {
      // Use the global token
      const token =
        global.customerAuthToken || global.testTokens?.customerAuthToken;

      if (!token) {
        throw new Error("No token available for test");
      }

      const response = await request(env.TEST_SERVER_URL)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${token}`);

      // Log response for debugging
      if (response.status !== 200) {
        console.log("Auth/me response:", response.body);
      }

      // Make test more permissive for now
      expect([200]).toContain(response.status);
      const responseData = response.body as SuccessResponse<UserResponseType>;

      expect(responseData).toHaveProperty("success", true);
      expect(responseData).toHaveProperty("data");
      expect(responseData.data).toHaveProperty("email");
      expect(responseData.data).toHaveProperty("userRoles");
      expect(responseData.data).toHaveProperty("firstName");
    });

    it("should reject unauthorized requests", async () => {
      const response = await request(env.TEST_SERVER_URL).get(
        "/api/v1/auth/me",
      );
      expect([401]).toContain(response.status);
    });
  });
});
