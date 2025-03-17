import { type JSX, useState } from "react";

import {
  useApiMutation,
  useApiQuery,
} from "../../../packages/next-portal/src/client/api/api-client";
import { loginEndpoint } from "../schema/api/apis";
import type {
  LoginFormType,
  LoginResponseType,
} from "../schema/api/v1/auth/public/login.schema";
import { restaurantsEndpoint } from "../schema/api/v1/restaurant/restaurants";

export function SimpleApiExample(): JSX.Element {
  const [credentials, setCredentials] = useState<LoginFormType>({
    email: "",
    password: "",
    remember: false,
  });

  // Login mutation - super simple!
  const login = useApiMutation<LoginResponseType, LoginFormType>(
    loginEndpoint,
    {
      onSuccess: (data) => {
        console.log("Login successful:", data);
      },
      onError: (error) => {
        console.error("Login failed:", error);
      },
    },
  );

  // Fetch restaurants query
  const { data: restaurants, error: restaurantsError } =
    useApiQuery(restaurantsEndpoint);

  return (
    <div>
      <h1>Simple API Example</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login.mutate(credentials);
        }}
      >
        <input
          type="email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          placeholder="Email"
        />
        <input
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          placeholder="Password"
        />
        <label>
          <input
            type="checkbox"
            checked={credentials.remember}
            onChange={(e) =>
              setCredentials({ ...credentials, remember: e.target.checked })
            }
          />
          Remember me
        </label>
        <button type="submit">Login</button>
      </form>

      {login.isLoading && <p>Logging in...</p>}
      {login.isError && <p>Login failed: {login.error.message}</p>}
      {login.isSuccess && <p>Login successful!</p>}

      <h2>Restaurants</h2>
      {restaurantsError && (
        <p>Error fetching restaurants: {restaurantsError.message}</p>
      )}
      {restaurants ? (
        <ul>
          {restaurants.map((restaurant) => (
            <li key={restaurant.id}>{restaurant.name}</li>
          ))}
        </ul>
      ) : (
        <p>Loading restaurants...</p>
      )}
    </div>
  );
}
