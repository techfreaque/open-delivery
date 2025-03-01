import { SignJWT } from "jose";

export interface TestAuthTokens {
  customerAuthToken: string;
  restaurantAuthToken: string;
  driverAuthToken: string;
  adminAuthToken: string;
}

/**
 * Generate test authentication tokens
 */
export async function generateTestTokens(): Promise<TestAuthTokens> {
  // Ensure we're using the same secret key consistently
  const JWT_SECRET_KEY =
    process.env.JWT_SECRET_KEY || "test-secret-key-for-e2e-tests";

  console.log("Generating tokens using JWT_SECRET_KEY:", JWT_SECRET_KEY);

  const secretKey = new TextEncoder().encode(JWT_SECRET_KEY);

  // Match the exact structure of the token returned by the login API:
  // Include createdAt and updatedAt dates that the backend expects
  const currentDate = new Date().toISOString();

  const customerAuthToken = await new SignJWT({
    id: "customer-user",
    email: "customer@example.com",
    name: "Test Customer",
    roles: ["CUSTOMER"],
    createdAt: currentDate,
    updatedAt: currentDate,
  })
    .setProtectedHeader({ alg: "HS256" }) // Remove "typ": "JWT" to match backend format
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey);

  console.log(
    "Generated customer token (first 30 chars):",
    customerAuthToken.substring(0, 30),
  );

  const restaurantAuthToken = await new SignJWT({
    id: "restaurant-user",
    email: "restaurant@example.com",
    name: "Test Restaurant User",
    roles: ["RESTAURANT_ADMIN"],
    createdAt: currentDate,
    updatedAt: currentDate,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey);

  const driverAuthToken = await new SignJWT({
    id: "driver-user",
    email: "driver@example.com",
    name: "Test Driver",
    roles: ["DRIVER"],
    createdAt: currentDate,
    updatedAt: currentDate,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey);

  const adminAuthToken = await new SignJWT({
    id: "admin-user",
    email: "admin@example.com",
    name: "Test Admin",
    roles: ["ADMIN"],
    createdAt: currentDate,
    updatedAt: currentDate,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey);

  return {
    customerAuthToken,
    restaurantAuthToken,
    driverAuthToken,
    adminAuthToken,
  };
}

// Special test token that middleware will recognize
export const TEST_AUTH_TOKEN = "test.token.test_signature_for_e2e_tests";
