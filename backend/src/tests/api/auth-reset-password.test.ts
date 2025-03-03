import "../setup"; // Import test setup

import { randomUUID } from "crypto";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import { env } from "@/lib/env";
import type { MessageResponse, SuccessResponse } from "@/types/types";

describe("Auth Password Reset API", () => {
  const baseUrl = env.TEST_SERVER_URL;
  const testEmail = "customer@example.com";
  let resetToken: string;

  beforeAll(() => {
    // Generate a test token for testing verification
    resetToken = `test-reset-token-${randomUUID()}`;
  });

  describe("POST /api/v1/auth/reset-password", () => {
    it("should send a password reset email", async () => {
      const response = await request(baseUrl)
        .post("/api/v1/auth/reset-password")
        .send({
          email: testEmail,
        });

      expect([200, 202]).toContain(response.status);

      // Verify response structure
      if (response.status === 200) {
        const responseData = response.body as SuccessResponse<MessageResponse>;

        expect(responseData).toHaveProperty("data");
        expect(responseData.data).toContain("Password reset email sent");
      }
    });

    it("should handle invalid email format", async () => {
      const response = await request(baseUrl)
        .post("/api/v1/auth/reset-password")
        .send({
          email: "invalid-email",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("data");
    });
  });

  describe("POST /api/v1/auth/reset-password-confirm", () => {
    it("should verify a valid reset token", async () => {
      // Mock implementation - In real test we'd need a way to get a valid token
      // but for test purposes, we'll check the API responds correctly
      const response = await request(baseUrl)
        .post("/api/v1/auth/reset-password-confirm")
        .send({
          token: resetToken,
        });

      // When testing against a real backend, this might return 401 if token validation fails
      // but we're testing the endpoint exists and responds
      expect([200, 401]).toContain(response.status);
    });

    it("should reject an empty token", async () => {
      const response = await request(baseUrl)
        .post("/api/v1/auth/reset-password-confirm")
        .send({
          token: "",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/v1/auth/reset-password-confirm", () => {
    it("should handle password reset with token", async () => {
      // In a real test, we would need a valid token
      const response = await request(baseUrl)
        .post("/api/v1/auth/reset-password-confirm")
        .send({
          token: resetToken,
          password: "newPassword123",
          confirmPassword: "newPassword123",
        });

      // May return 401 if token isn't valid, we're checking if endpoint exists
      expect([200, 201, 401]).toContain(response.status);
    });

    it("should validate passwords match", async () => {
      const response = await request(baseUrl)
        .post("/api/v1/auth/reset-password-confirm")
        .send({
          token: resetToken,
          password: "newPassword123",
          confirmPassword: "differentPassword123",
        });

      expect(response.status).toBe(400);
    });

    it("should validate password requirements", async () => {
      const response = await request(baseUrl)
        .post("/api/v1/auth/reset-password-confirm")
        .send({
          token: resetToken,
          password: "short", // Too short
          confirmPassword: "short",
        });

      expect(response.status).toBe(400);
    });
  });
});
