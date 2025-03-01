/* eslint-disable no-console */
import type { Server } from "http";
import { createServer } from "http";
import type { AddressInfo } from "net";
import next from "next";
import { parse } from "url";

// Server state (singleton)
let app: ReturnType<typeof next> | null = null;
let server: Server | null = null;
let baseUrl: string | null = null;
let startPromise: Promise<string> | null = null;

/**
 * Starts the Next.js test server on a fixed port
 * This is designed to be called once from global-setup
 */
export async function startServer(port: number = 4000): Promise<string> {
  // If we're already in the process of starting the server, return that promise
  if (startPromise) {
    return startPromise;
  }

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

  // Create a promise that will be returned to all callers
  startPromise = new Promise<string>(async (resolve, reject) => {
    try {
      console.log("Starting test server on port", port, "...");

      // Ensure we're using test environment variables
      process.env.NODE_ENV = "test";

      // Set JWT secret key - This is the key part to ensure consistent JWT handling
      process.env.JWT_SECRET_KEY = "test-secret-key-for-e2e-tests";
      console.log(
        "Set JWT_SECRET_KEY for test server:",
        process.env.JWT_SECRET_KEY,
      );

      app = next({
        dev: true,
        dir: process.cwd(),
        quiet: true, // Reduce console noise
      });

      await app.prepare();

      const handle = app.getRequestHandler();

      server = createServer((req, res) => {
        const parsedUrl = parse(req.url || "", true);
        void handle(req, res, parsedUrl);
      });

      server.once("error", (err) => {
        console.error("Server startup error:", err);

        // If the port is in use, check if it's our own server from another test file
        if (err.code === "EADDRINUSE") {
          console.warn(
            `Port ${port} is already in use. Trying to use existing server.`,
          );

          // Assume the server might be started by another test file
          baseUrl = `http://localhost:${port}`;
          process.env.TEST_SERVER_URL = baseUrl;

          // Reset promise so others know we're not starting anymore
          startPromise = null;

          // Resolve with the assumed URL
          resolve(baseUrl);
          return;
        }

        startPromise = null;
        reject(err);
      });

      server.listen(port, () => {
        const address = server?.address() as AddressInfo;
        baseUrl = `http://localhost:${address.port}`;
        console.log(`> E2E test server started on ${baseUrl}`);

        // Store URL in env var so other processes can use it
        process.env.TEST_SERVER_URL = baseUrl;

        // Reset the promise now that we're done
        startPromise = null;

        resolve(baseUrl);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      startPromise = null;
      reject(error);
    }
  });

  return startPromise;
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

/**
 * Gets the base URL of the running server
 * If the server hasn't been started yet, the URL is retrieved from environment variable
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
