/* eslint-disable no-console */
import { spawn } from "child_process";
import type { Server } from "http";
import { createServer } from "http";
import type { AddressInfo } from "net";
import next from "next";
import path from "path";
import { parse } from "url";

// Server state (singleton)
let app: ReturnType<typeof next> | null = null;
let server: Server | null = null;
let baseUrl: string | null = null;

/**
 * Gets a free port by testing ports sequentially
 */
async function getFreePort(startPort: number = 4000): Promise<number> {
  let port = startPort;
  let maxTries = 20; // Increase max tries

  while (maxTries > 0) {
    try {
      const testServer = createServer();

      await new Promise<void>((resolve, reject) => {
        testServer.once("error", (err: Error & { code?: string }) => {
          if (err.code === "EADDRINUSE") {
            port++;
            testServer.close();
            resolve();
          } else {
            reject(err);
          }
        });

        testServer.once("listening", () => {
          testServer.close();
          resolve();
        });

        testServer.listen(port);
      });

      return port; // Port is available
    } catch (err) {
      console.error(`Error trying port ${port}:`, err);
      port++;
      maxTries--;
    }
  }

  throw new Error("Could not find a free port after multiple attempts");
}

/**
 * Starts the Next.js test server
 * This is designed to be called once from global-setup
 */
export async function startServer(): Promise<string> {
  if (server) {
    console.log("Test server already running at:", baseUrl);
    return baseUrl as string;
  }

  // Check if we have a URL from a previously started server via env var
  if (process.env.TEST_SERVER_URL) {
    baseUrl = process.env.TEST_SERVER_URL;
    console.log("Using existing test server at:", baseUrl);
    return baseUrl;
  }

  try {
    const port = await getFreePort();
    console.log(`Starting test server on port ${port}...`);

    // Ensure we're using test environment variables
    process.env.NODE_ENV = "test";
    process.env.JWT_SECRET_KEY = "test-secret-key-for-e2e-tests";

    app = next({
      dev: true,
      dir: process.cwd(),
    });

    await app.prepare();

    const handle = app.getRequestHandler();

    server = createServer((req, res) => {
      const parsedUrl = parse(req.url || "", true);
      void handle(req, res, parsedUrl);
    });

    return new Promise<string>((resolve, reject) => {
      if (!server) {
        return reject(new Error("Server initialization failed"));
      }

      server.once("error", (err) => {
        console.error("Server startup error:", err);
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
  return new Promise((resolve, reject) => {
    if (!server) {
      const err = new Error("Server is not running.");
      Object.defineProperty(err, "code", { value: "ERR_SERVER_NOT_RUNNING" });
      reject(err);
      return;
    }

    server.close((err) => {
      if (err) {
        console.error("Error closing server:", err);
        reject(err);
        return;
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

/**
 * Starts a test server in a separate process
 */
export function startTestServer(): Promise<string> {
  return new Promise((resolve, reject) => {
    const testAppPath = path.join(process.cwd(), "src", "tests", "test-app.ts");

    const serverProcess = spawn("tsx", [testAppPath], {
      env: {
        ...process.env,
        NODE_ENV: "test",
      },
      stdio: ["pipe", "pipe", "pipe", "ipc"],
    });

    serverProcess.on("message", (message: { port: number }) => {
      baseUrl = `http://localhost:${message.port}`;
      resolve(baseUrl);
    });
    if (!serverProcess.stderr) {
      return reject(new Error("Failed to start test server: no stderr"));
    }
    serverProcess.stderr.on("data", (data) => {
      const errorMessage = data.toString();
      console.error(`Test server error: ${errorMessage}`);
      reject(new Error(`Failed to start test server: ${errorMessage}`));
    });

    // Set timeout in case server doesn't start
    setTimeout(() => {
      reject(new Error("Timeout waiting for test server to start"));
    }, 10000);
  });
}
