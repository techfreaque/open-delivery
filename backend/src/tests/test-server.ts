/* global NodeJS */
/* eslint-disable no-console */
import type { Server } from "http";
import { createServer } from "http";
import type { AddressInfo } from "net";
import next from "next";
import { parse } from "url";

import type { Env } from "@/lib/env";

// Server state (singleton)
let app: ReturnType<typeof next> | null = null;
let server: Server | null = null;
let baseUrl: string | null = null;

/**
 * Gets the base URL of the running server
 */
export function getBaseUrl(): string {
  if (baseUrl) {
    return baseUrl;
  }

  // Check if we have a URL from a previously started server
  if (process.env.TEST_SERVER_URL) {
    baseUrl = process.env.TEST_SERVER_URL;
    return baseUrl;
  }

  throw new Error(
    "Server not started. Call startServer() first or ensure global setup has run.",
  );
}

/**
 * Starts the Next.js test server on a fixed port
 * This is designed to be called once from global-setup
 */
export async function startServer(port: number = 4000): Promise<string> {
  // If server is already running, just return the URL
  if (server && baseUrl) {
    console.log("Test server already running at:", baseUrl);
    return baseUrl;
  }

  // Check if we have a URL from a previously started server via env var
  if (process.env.TEST_SERVER_URL) {
    baseUrl = process.env.TEST_SERVER_URL;
    console.log("Using existing test server at:", baseUrl);
    return baseUrl;
  }

  try {
    console.log("Starting test server on port", port, "...");

    // Ensure we're using test environment variables
    (process.env as Env).NODE_ENV = "test";

    // Set JWT secret key
    process.env.JWT_SECRET_KEY = "test-secret-key-for-e2e-tests";
    console.log(
      "Set JWT_SECRET_KEY for test server:",
      process.env.JWT_SECRET_KEY,
    );

    app = next({
      dev: true,
      dir: process.cwd(),
      quiet: false, // Enable to see more details
    });

    await app.prepare();

    const handle = app.getRequestHandler();

    return new Promise((resolve, reject) => {
      server = createServer((req, res) => {
        const parsedUrl = parse(req.url || "", true);
        void handle(req, res, parsedUrl);
      });

      server.once("error", (err: NodeJS.ErrnoException) => {
        console.error("Server startup error:", err);

        // If the port is in use, check if it's our own server from another test file
        if (err.code === "EADDRINUSE") {
          reject(err);
          return;
        }

        reject(err);
      });

      server.listen(port, () => {
        const address = server?.address() as AddressInfo;
        baseUrl = `http://localhost:${address.port}`;
        console.log(`> E2E test server started on ${baseUrl}`);

        // Store URL in env var so other processes can use it
        process.env.TEST_SERVER_URL = baseUrl;

        resolve(baseUrl);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    throw error;
  }
}

/**
 * Stops the test server
 * This is designed to be called once from global-teardown
 */
export async function stopServer(): Promise<void> {
  return new Promise((resolve) => {
    if (!server) {
      console.log("Server is not running, nothing to stop");
      resolve();
      return;
    }

    server.close((err) => {
      if (err) {
        console.error("Error closing server:", err);
        // Resolve anyway since we're shutting down
      }

      console.log("> E2E test server closed");
      server = null;
      app = null;
      baseUrl = null;

      // Clear environment variable
      delete process.env.TEST_SERVER_URL;

      resolve();
    });
  });
}
