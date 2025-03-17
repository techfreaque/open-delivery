import type { JSX } from "react";
import { useState } from "react";

import type { UndefinedType } from "@/next-portal/types/common.schema";

import { ApiEndpoint } from "../../../packages/next-portal/src/api/endpoint";
import {
  useApiMutation,
  useApiQuery,
} from "../../../packages/next-portal/src/client/api/api-client";
import { UserRoleValue } from "../../../packages/next-portal/src/types/enums";
import { loginResponseSchema, loginSchema } from "../schema/schemas";
import type { LoginFormType, LoginResponseType } from "../types/types";

// Example API endpoint definition
const loginEndpoint: ApiEndpoint<
  LoginFormType,
  LoginResponseType,
  UndefinedType
> = {
  path: ["v1", "auth", "login"],
  method: "POST",
  allowedRoles: [UserRoleValue.PUBLIC],
  requestSchema: loginSchema,
  responseSchema: loginResponseSchema,
};

// Example restaurants endpoint definition
// Using RestaurantResponseType[] would be better for real usage
const restaurantsEndpoint: ApiEndpoint<void, any> = {
  path: ["v1", "restaurants"],
  method: "GET",
  requiresAuth: true,
  responseSchema: loginResponseSchema, // Replace with proper restaurants schema
};

export function ApiUsageExample(): JSX.Element {
  const [credentials, setCredentials] = useState<LoginFormType>({
    email: "",
    password: "",
    remember: false,
  });

  // Use mutation for login
  const loginMutation = useApiMutation<LoginResponseType, LoginFormType>(
    new ApiEndpoint(loginEndpoint),
    {
      onSuccess: (data) => {
        console.log("Login successful:", data);
      },
      onError: (error) => {
        console.error("Login failed:", error.message);
      },
      // Update the restaurant list when login is successful
      invalidateQueries: [["restaurants"]],
    },
  );

  // Use query for fetching restaurants with local caching
  const {
    data: restaurants,
    isLoading,
    isFetching,
    isLoadingFresh, // New property that tells if we're loading with no cached data
    error,
  } = useApiQuery(["restaurants"], new ApiEndpoint(restaurantsEndpoint), {
    enabled: loginMutation.isSuccess, // Only run after login success
    // Default behavior uses local cache but can be disabled:
    // disableLocalCache: true,
  });

  const handleLogin = (): void => {
    loginMutation.mutate(credentials);
  };

  return (
    <div>
      <h1>API Usage Example</h1>

      {/* Login Form */}
      <div>
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <button onClick={handleLogin} disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>
      </div>

      {/* Show login error */}
      {loginMutation.isError && (
        <div style={{ color: "red" }}>{loginMutation.error.message}</div>
      )}

      {/* Show restaurants */}
      {isLoadingFresh ? (
        <div>Loading restaurants...</div>
      ) : (
        <>
          {/* Show background refresh indicator */}
          {isFetching && <div style={{ color: "gray" }}>Refreshing...</div>}
          <div>
            <h2>Restaurants</h2>
            <pre>{JSON.stringify(restaurants, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
}
