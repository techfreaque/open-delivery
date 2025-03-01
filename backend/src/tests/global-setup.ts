/* eslint-disable no-console */

import { startServer } from "./test-server";

export async function setup(): Promise<void> {
  console.log("Running global setup...");
  try {
    const baseUrl = await startServer();
    console.log(`Successfully started test server at ${baseUrl}`);
    process.env.TEST_SERVER_URL = baseUrl;
  } catch (error) {
    console.error("Failed to start server in global setup:", error);
    throw error;
  }
}

export default setup;
