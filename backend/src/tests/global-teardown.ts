/**
 * Global teardown for all tests
 * This runs once after all tests complete
 */
import { stopServer } from "./test-server";

export async function teardown() {
  await stopServer();
  console.log("Test server stopped");
}
